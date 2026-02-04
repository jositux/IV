import useSWR from 'swr';
import { fetchUserProfile } from "@/services/user-full-service";
import { getAuthToken } from "@/lib/get-auth-token";

const getCookie = (name: string) => {
  if (typeof window === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
};

/**
 * Fetcher unificado: Obtiene la identidad (Auth0) y el perfil (Backend) en paralelo
 * para minimizar latencia y evitar errores 429.
 */
async function unifiedUserFetcher(userId: string) {
  const token = await getAuthToken();
  if (!token) return null;

  // Ejecutamos ambas peticiones en paralelo para máxima velocidad
  const [authRes, profileData] = await Promise.all([
    fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } }).then(res => 
      res.status === 429 ? { error: "rate-limit" } : res.json()
    ),
    fetchUserProfile(userId)
  ]);

  // Combinamos la identidad (nombre/foto) con el balance de créditos
  return {
    ...authRes,     // name, picture, email
    ...profileData, // currentCreditBalance, etc.
    isRateLimited: authRes.error === "rate-limit"
  };
}

export function useUserProfile() {
  const userId = getCookie("user_id");

  const { data, mutate, isLoading, error } = useSWR(
    userId ? `unified-profile-${userId}` : null,
    () => unifiedUserFetcher(userId!),
    { 
      revalidateOnFocus: false, // Vital para evitar 429 al cambiar de ventana
      dedupingInterval: 10000,   // Cache de 10 segundos para peticiones idénticas
      keepPreviousData: true 
    }
  );

  const realBalance = data?.currentCreditBalance ?? 0;

  const getProjectedBalance = () => {
    if (typeof window === 'undefined') return realBalance;
    try {
      const storedData = localStorage.getItem("active_generation_projects");
      if (!storedData) return realBalance;
      const activeProjects = Object.values(JSON.parse(storedData));
      if (activeProjects.length === 0) return realBalance;

      const snapshots = activeProjects.map((p: any) => Number(p.initialBalanceSnapshot) || 0);
      const initialCeiling = Math.max(...snapshots, realBalance);
      const chargedByBackend = Math.max(0, initialCeiling - realBalance);
      const totalPlannedDebt = activeProjects.reduce((acc: number, proj: any) => 
        proj.error ? acc : acc + (Number(proj.duration) || 0), 0);

      return Math.max(0, realBalance - Math.max(0, totalPlannedDebt - chargedByBackend));
    } catch (e) { return realBalance; }
  };

  return {
    user: data,
    projectedBalance: getProjectedBalance(),
    realBalance,
    mutate,
    isLoading: isLoading || (!data && !!userId),
    isError: !!error || data?.isRateLimited
  };
}