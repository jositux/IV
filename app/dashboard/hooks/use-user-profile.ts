import useSWR from 'swr';
import { fetchUserProfile } from "@/services/user-full-service";

export function useUserProfile() {
  // Obtenemos el ID del localStorage (solo en cliente)
  const userId = typeof window !== 'undefined' ? localStorage.getItem("user") : null;

  const { data, mutate } = useSWR(
    userId ? `user-profile-${userId}` : null,
    () => fetchUserProfile(userId!),
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000, // Evita peticiones repetidas
    }
  );

  return {
    user: data,
    mutate, // Esta función es la clave para actualizar desde fuera
    isLoading: !data && !!userId
  };
}