export interface AddCreditRequest {
  amount: number
  description: string
}

export interface AddCreditResponse {
  success: boolean
  newBalance: number
  transactionId: string
}

/**
 * Agrega créditos a un usuario
 * @param token - JWT token de autenticación
 * @param userId - ID del usuario
 * @param request - Cantidad y descripción de créditos
 */
export const addCreditToUser = async (
  token: string,
  userId: string,
  request: AddCreditRequest,
): Promise<AddCreditResponse> => {
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
