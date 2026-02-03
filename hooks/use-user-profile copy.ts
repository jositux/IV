import useSWR from 'swr';
import { fetchUserProfile } from "@/services/user-full-service";

export function useUserProfile() {
  const userId = typeof window !== 'undefined' ? localStorage.getItem("user") : null;

  const { data, mutate, isValidating } = useSWR(
    userId ? `user-profile-${userId}` : null,
    () => fetchUserProfile(userId!),
    {
      revalidateOnFocus: true, // Cambia a true para que al volver a la pestaña se refresquen los créditos
      dedupingInterval: 2000,  // Redúcelo a 2 segundos para permitir actualizaciones rápidas tras generar videos
    }
  );

  return {
    user: data,
    mutate,
    isLoading: !data && !!userId,
    isValidating // Útil para mostrar un spinner pequeño en el Header si quieres
  };
}