import useSWR from 'swr';
import { fetchUserProfile } from "@/services/user-full-service";

export function useUserProfile() {
  const userId = typeof window !== 'undefined' ? localStorage.getItem("user") : null;

  const { data, mutate } = useSWR(
    userId ? `user-profile-${userId}` : null,
    () => fetchUserProfile(userId!),
    { 
      revalidateOnFocus: true, 
      dedupingInterval: 2000 
    }
  );

  const realBalance = data?.currentCreditBalance ?? 0;

  const getProjectedBalance = () => {
    // Protección para Server Side Rendering
    if (typeof window === 'undefined') return realBalance;

    try {
      const storedData = localStorage.getItem("active_generation_projects");
      if (!storedData) return realBalance;

      const projectsObj = JSON.parse(storedData);
      const activeProjects = Object.values(projectsObj);
      
      if (activeProjects.length === 0) return realBalance;

      // 1. Snapshot más alto (Techo original)
      // Usamos Number() y fallback a 0 para evitar que un NaN rompa el Math.max
      const snapshots = activeProjects.map((p: any) => Number(p.initialBalanceSnapshot) || 0);
      const initialCeiling = Math.max(...snapshots, realBalance);
      
      // 2. Cuánto ha cobrado ya el servidor
      const amountAlreadyChargedByBackend = Math.max(0, initialCeiling - realBalance);

      // 3. Deuda total que tenemos en el localStorage actual
      const totalPlannedDebt = activeProjects.reduce((acc: number, proj: any) => {
        if (proj.error) return acc;
        return acc + (Number(proj.duration) || 0);
      }, 0);

      // 4. Reserva pendiente: Deuda total menos lo que ya se cobró
      const remainingLocalReservation = Math.max(0, totalPlannedDebt - amountAlreadyChargedByBackend);

      const projected = realBalance - remainingLocalReservation;
      return Math.max(0, projected);

    } catch (e) {
      // Si el JSON está mal formado, limpiamos y devolvemos el real para no bloquear la UI
      console.error("Critical error in getProjectedBalance:", e);
      return realBalance;
    }
  };

  return {
    user: data,
    projectedBalance: getProjectedBalance(),
    realBalance: realBalance,
    mutate,
    isLoading: !data && !!userId
  };
}