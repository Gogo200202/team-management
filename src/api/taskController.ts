import { useMutation, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

import { axiosClient } from "../config/axios.config";
import { queryClient } from "../config/queryClient.config";
import type { Task } from "./types/taskType";

export const taskKeys = {
  allTasks: ["allTasks"],
  userDetails: (taskId: string) => [taskKeys.allTasks, `userDetails-${taskId}`],
};

export const useGetAllTask = () => {
  return useQuery<Task[]>({
    queryKey: taskKeys.allTasks,
    queryFn: async () => {
      const { data } = await axiosClient.get(`/tasks`);

      return data;
    },
  });
};
type CreateTask = Omit<Task, "id" | "createdAt" | "updatedAt">;
export const useCreateTask = () => {
  return useMutation({
    mutationFn: async (createBody: CreateTask) => {
      const { data } = await axiosClient.post("/tasks", {
        ...createBody,
        createdAt: dayjs().toISOString(),
        updatedAt: dayjs().toISOString(),
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.allTasks });
    },
  });
};
