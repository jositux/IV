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

interface UseBackendAuthReturn {
  backendUser: BackendUser | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useBackendAuth(): UseBackendAuthReturn {
  const {
    getAccessTokenSilently,
    isAuthenticated,
    isLoading: auth0Loading,
  } = useAuth0();
  const [backendUser, setBackendUser] = useState<BackendUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    // Si Auth0 está cargando, esperamos.
    if (auth0Loading) return;

    try {
      setLoading(true);
      setError(null);

      let accessToken = null;

      // 1. Priorizamos obtener el token fresco del SDK si estamos autenticados
      if (isAuthenticated) {
        try {
          accessToken = await getAccessTokenSilently();
          console.log("Que onda");
          // localStorage.setItem('access_token', accessToken);
        } catch (tokenErr) {
          console.error("Error obteniendo token fresco:", tokenErr);
          // Fallback al localStorage si el SDK falla
          accessToken = await getAuthToken();
        }
      } else {
        // Si no está autenticado en Auth0, vemos si hay un token viejo
        accessToken = await getAuthToken();
      }

      if (!accessToken) {
        setBackendUser(null);
        setLoading(false);
        return;
      }

      const response = await fetch("/gateway/auth/callback", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessToken }),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("access_token");
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}`);
      }

      const userData = await response.json();
      setBackendUser(userData);

      //console.log("user real data", userData)
      localStorage.setItem("user", userData.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching backend user:", err);
      setBackendUser(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, auth0Loading, getAccessTokenSilently]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    backendUser,
    loading,
    error,
    refetch: fetchUser,
  };
}
