export interface CreditTransaction {
  transactionId: string;
  amount: number;
  transactionType: "credit" | "debit";
  description: string;
  projectId: string | null;
  subscriptionTypeId: string | null;
  createdAt: string;
}

export interface CreditHistoryResponse {
  success: boolean;
  data: {
    userId: string;
    currentBalance: number;
    totalTransactions: number;
    transactions: CreditTransaction[];
  };
}

/**
 * Obtiene el balance y el historial de créditos del usuario.
 * Endpoint: /users/{{user_id}}/credits/history
 */
export const getCreditHistory = async (
  token: string,
  userId: string
): Promise<CreditHistoryResponse> => {
  const response = await fetch(`/gateway/users/${userId}/credits/history`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: No se pudo obtener el balance.`);
  }

  return response.json();
};