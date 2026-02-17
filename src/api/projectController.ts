import { useQuery } from "@tanstack/react-query";

import { axiosClient } from "../config/axios.config";
import type { Project } from "./projectTypes";

export const projectKeys = {
  allProjects: ["allProject"],
  projectDetails: (projectId: string) => [
    projectKeys.allProjects,
    `projectDetails-${projectId}`,
  ],
};

export const useGetAllProjects = () => {
  return useQuery<Project[]>({
    queryKey: projectKeys.allProjects,
    queryFn: async () => {
      const { data } = await axiosClient.get(`/projects`);

      return data;
    },
  });
};
