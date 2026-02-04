/**
 * Helper interno para leer cookies de forma síncrona.
 */
 const getCookie = (name: string) => {
  if (typeof window === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return null;
};

/**
 * Obtiene el token de autenticación.
 * Primero intenta leerlo de la cookie (instantáneo).
 * Si no existe, lo pide a la API y lo guarda en la cookie.
 */
export async function getAuthToken(): Promise<string> {
  if (typeof window === "undefined") return "";

  // 1. Intentar obtener el token de la memoria/cookie (0ms latencia)
  const cachedToken = getCookie("access_token");
  if (cachedToken) {
    return cachedToken;
  }

  // 2. Si no hay cookie, vamos a la API (Latencia de red)
  try {
    const response = await fetch("/api/token");
    if (!response.ok) throw new Error("Failed to fetch token");
    
    const data = await response.json();
    const token = data.token || "";

    if (token) {
      // 3. Guardamos en cookie para la próxima llamada.
      // Ajusta 'max-age' (segundos) según la expiración real de tu token (ej. 1 hora = 3600)
      document.cookie = `access_token=${token}; path=/; max-age=3600; SameSite=Lax`;
    }

    return token;
  } catch (error) {
    console.error("Failed to get auth token:", error);
    return "";
  }
}