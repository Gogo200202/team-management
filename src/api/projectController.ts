import { useMutation, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

import { axiosClient } from "../config/axios.config";
import { queryClient } from "../config/queryClient.config";
import type { Project } from "./types/projectTypes";

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

export const useGetProject = (id: string) => {
  return useQuery<Project>({
    queryKey: projectKeys.projectDetails(id),
    queryFn: async () => {
      const { data } = await axiosClient.get(`/projects/${id}`);

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
    meta: {
      type: "Create",
      dataOf: "Project",
    },
  });
};
type UpdateProject = Omit<Project, "updatedAt">;
export const useUpdateProject = () => {
  return useMutation({
    mutationFn: async (project: UpdateProject) => {
      const { data } = await axiosClient.patch(`/projects/${project.id}`, {
        ...project,
        updatedAt: dayjs().toISOString(),
      });

      return data;
    },
    onSuccess: (data: Project) => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.projectDetails(data.id),
      });

      queryClient.invalidateQueries({ queryKey: projectKeys.allProjects });
    },
    meta: {
      type: "Edit",
      dataOf: "Project",
    },
  });
};

export const useDeleteProject = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axiosClient.delete(`/projects/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.allProjects });
    },
    meta: {
      type: "Delete",
      dataOf: "Project",
    },
  });
};
