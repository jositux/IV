import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getVideosByUser, type UserVideo } from "@/services/video/video-by-user";
import { getListProjects, type Project } from "@/services/get-list-projects";
import DashboardClient from "./dashboard-client";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value || null;

  // Redirección inmediata si no hay sesión
  if (!token) {
    redirect("/login");
  }

  // Tipado explícito para evitar errores de 'any'
  let initialVideos: UserVideo[] = [];
  let initialProjects: Project[] = [];
  
  try {
    // Obtenemos los datos en paralelo para máxima velocidad
    const [vRes, pRes] = await Promise.all([
      getVideosByUser(token, ""), // El backend debe extraer el userId del JWT
      getListProjects(token)
    ]);
    
    initialVideos = vRes.data || [];
    initialProjects = pRes.success ? pRes.data : [];
  } catch (error) {
    console.error("Error cargando datos en SSR:", error);
  }

  return (
    <DashboardClient 
      initialVideos={initialVideos} 
      initialProjects={initialProjects} 
      serverToken={token}
    />
  );
}