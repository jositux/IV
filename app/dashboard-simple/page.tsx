import { cookies } from "next/headers";
import { AppHeader } from "@/components/shared/app-header";
import { AppFooter } from "@/components/shared/app-footer";
import { getVideosByUser } from "@/services/video/video-by-user";
import { getListProjects } from "@/services/get-list-projects";
import { DashboardContent } from "./components";

// Server Component - fetches data on the server
export default async function Dashboard() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth_token")?.value;
  const userId = cookieStore.get("user_id")?.value;

  let initialVideos: Awaited<ReturnType<typeof getVideosByUser>>["data"] = [];
  let initialProjects: Awaited<ReturnType<typeof getListProjects>>["data"] = [];
  let initialHasContent = false;

  // Fetch data on server - no loading state needed if no content
  if (authToken && userId) {
    try {
      const [videosRes, projectsRes] = await Promise.all([
        getVideosByUser(authToken, userId),
        getListProjects(authToken),
      ]);

      initialVideos = videosRes.data || [];
      initialProjects = projectsRes.success ? projectsRes.data : [];
      initialHasContent = initialVideos.length > 0;
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F6F6] p-4">
      <AppHeader />
      <main className="mx-auto py-16 px-4">
        <DashboardContent
          initialVideos={initialVideos}
          initialProjects={initialProjects}
          initialHasContent={initialHasContent}
        />
      </main>
      <AppFooter />
    </div>
  );
}
