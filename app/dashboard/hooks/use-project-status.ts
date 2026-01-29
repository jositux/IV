import useSWR from "swr";
import { getProjectById } from "@/services/get-project-by-id";

const projectFetcher = async ([_, token, projectId]: [string, string, string]) => {
  const res = await getProjectById(token, projectId);
  return res.data;
};

export function useProjectStatus(projectId: string | null, token: string | null, initialStatus: string) {
  const isTransient = ["processing", "queued", "pending"].includes(initialStatus?.toLowerCase());

  const { data, mutate } = useSWR(
    isTransient && projectId && token ? ["project-status", token, projectId] : null,
    projectFetcher,
    { refreshInterval: 5000, revalidateOnFocus: true }
  );

  return {
    updatedVideo: data?.videos?.[0] || null,
    mutate
  };
}