"use client";

import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState, useCallback } from "react";
import { getAuthToken } from "@/lib/get-auth-token";

interface BackendUser {
  id: string;
  auth0_id: string;
  email: string;
  name?: string;
  picture?: string;
  role?: string;
  credits?: number;
  created_at?: string;
}

export function useBackendAuth() {
  const { getAccessTokenSilently, isAuthenticated, isLoading: auth0Loading } = useAuth0();
  const [backendUser, setBackendUser] = useState<BackendUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper: Guarda la cookie. SameSite=Lax es estándar de seguridad moderno.
  const setCookie = (name: string, value: string) => {
    const expires = new Date(Date.now() + 7 * 864e5).toUTCString(); // 7 días
    document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
  };

  // Helper: Elimina la cookie al expirar la sesión o dar error.
  const deleteCookie = (name: string) => {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  };

  const fetchUser = useCallback(async () => {
    if (auth0Loading) return;

    try {
      setLoading(true);
      let accessToken = null;

      if (isAuthenticated) {
        try {
          accessToken = await getAccessTokenSilently();
        } catch (tokenErr) {
          accessToken = await getAuthToken(); // Fallback
        }
      } else {
        accessToken = await getAuthToken();
      }

      if (!accessToken) {
        setBackendUser(null);
        setLoading(false);
        return;
      }

      const response = await fetch("/gateway/auth/callback", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken }),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) deleteCookie("user_id");
        throw new Error(`Error ${response.status}`);
      }

      const userData: BackendUser = await response.json();
      
      // Sincronización: Guardamos en estado y en Cookie inmediatamente
      setBackendUser(userData);
      setCookie("user_id", userData.id);

    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setBackendUser(null);
      deleteCookie("user_id");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, auth0Loading, getAccessTokenSilently]);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  return { backendUser, loading, error, refetch: fetchUser };
}