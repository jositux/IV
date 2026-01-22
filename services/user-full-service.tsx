export interface UserProfile {
  id: string;
  email: string;
  name: string;
  currentCreditBalance: number;
  subscriptionType: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Obtiene los datos detallados de un usuario sin necesidad de token
 * @param userId - El UUID del usuario (ej: 9a90dddb...)
 */
export const fetchUserProfile = async (userId: string): Promise<UserProfile> => {
  // Seguimos usando el proxy para evitar CORS y llegar a majomaken.dev/api/users/
  const response = await fetch(`/gateway/users/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: No se pudo obtener el perfil`);
  }

  return response.json();
};