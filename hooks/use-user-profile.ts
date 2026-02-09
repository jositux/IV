import useSWR from 'swr';
import { fetchUserProfile } from "@/services/user-full-service";
import { getAuthToken } from "@/lib/get-auth-token";

// --- Helpers ---

const getCookie = (name: string) => {
  if (typeof window === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
};

/**
 * Fetcher unificado: Ahora recibe el token explícitamente.
 * Si el token o el userId faltan, el fetcher no debería siquiera ejecutarse.
 */
async function unifiedUserFetcher(userId: string, token: string) {
  // Ejecutamos ambas peticiones en paralelo para máxima velocidad
  const [authRes, profileData] = await Promise.all([
    fetch("/api/auth/me", { 
      headers: { Authorization: `Bearer ${token}` } 
    }).then(async (res) => {
      if (res.status === 429) return { error: "rate-limit" };
      if (!res.ok) throw new Error("Error fetching Auth0 profile");
      return res.json();
    }),
    fetchUserProfile(userId)
  ]);

  return {
    ...authRes,     // name, picture, email
    ...profileData, // currentCreditBalance, etc.
    isRateLimited: authRes.error === "rate-limit"
  };
}

// --- Hook Principal ---

export function useUserProfile() {
  const userId = getCookie("user_id");

  // Usamos un array como key para que SWR reaccione a cambios en userId
  const { data, mutate, isLoading, error } = useSWR(
    userId ? ["unified-profile", userId] : null,
    async ([, id]) => {
      const token = await getAuthToken();
      
      // Si hay cookie de ID pero no hay sesión de Auth0, lanzamos error 
      // para que SWR deje de estar en estado "loading".
      if (!token) {
        throw new Error("No session found");
      }
      
      return unifiedUserFetcher(id, token);
    },
    { 
      revalidateOnFocus: false, 
      dedupingInterval: 10000,   
      keepPreviousData: true,
      shouldRetryOnError: false // Importante: si no hay token, no reintentes infinitamente
    }
  );

  const realBalance = data?.currentCreditBalance ?? 0;

  /**
   * Calcula el balance proyectado considerando el estado de PROMPT
   * y las generaciones de video activas en el cliente.
   */
  const getProjectedBalance = () => {
    if (typeof window === 'undefined') return realBalance;
    try {
      const storedData = localStorage.getItem("active_generation_projects");
      if (!storedData) return realBalance;
      
      const activeProjects = Object.values(JSON.parse(storedData));
      if (activeProjects.length === 0) return realBalance;

      // Lógica de cálculo de deuda proyectada
      const snapshots = activeProjects.map((p: any) => Number(p.initialBalanceSnapshot) || 0);
      const initialCeiling = Math.max(...snapshots, realBalance);
      const chargedByBackend = Math.max(0, initialCeiling - realBalance);
      
      const totalPlannedDebt = activeProjects.reduce((acc: number, proj: any) => 
        proj.error ? acc : acc + (Number(proj.credits) || 0), 0);

      const debtRemaining = Math.max(0, totalPlannedDebt - chargedByBackend);
      return Math.max(0, realBalance - debtRemaining);
    } catch (e) { 
      console.error("Error calculating projected balance:", e);
      return realBalance; 
    }
  };

  return {
    user: data,
    projectedBalance: getProjectedBalance(),
    realBalance,
    mutate,
    // Corregido: Si hay error (como "No session found"), isLoading debe ser false
    isLoading: isLoading || (!data && !error && !!userId),
    isError: !!error || data?.isRateLimited,
    errorMessage: error?.message
  };
}