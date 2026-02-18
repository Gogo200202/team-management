import { useMutation, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

import { axiosClient } from "../config/axios.config";
import { queryClient } from "../config/queryClient.config";
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

type CreateProject = Omit<Project, "id" | "createdAt" | "updatedAt">;
export const useCreateProject = () => {
  return useMutation({
    mutationFn: async (project: CreateProject) => {
      const { data } = await axiosClient.post(`/projects`, {
        ...project,
        createdAt: dayjs().toISOString(),
        updatedAt: dayjs().toISOString(),
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.allProjects });
    },
  });
};
