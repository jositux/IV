export interface AddCreditsRequest {
  amount: number
  reason?: string
}

export interface AddCreditsResponse {
  success: boolean
  data: {
    newBalance: number
    message: string
  }
}

/**
 * Agrega créditos a un usuario
 * @param token - JWT token de autenticación
 * @param userId - ID del usuario
 * @param request - Cantidad y razón de créditos
 */
export const addUserCredits = async (
  token: string,
  userId: string,
  request: AddCreditsRequest,
): Promise<AddCreditsResponse> => {
  const response = await fetch(`/gateway/users/${userId}/credits`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error(`Error ${response.status}: No se pudieron agregar créditos`)
  }

  return response.json()
}
