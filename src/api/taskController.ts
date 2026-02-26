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
    meta: {
      type: "Create",
      dataOf: "Task",
    },
  });
};

export const useDeleteTask = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axiosClient.delete(`/tasks/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.allTasks });
    },
    meta: {
      type: "Delete",
      dataOf: "Task",
    },
  });
};

type UpdateTask = Omit<Task, "updatedAt">;
export const useUpdateTask = () => {
  return useMutation({
    mutationFn: async (updateBody: UpdateTask) => {
      const { data } = await axiosClient.patch(`/tasks/${updateBody.id}`, {
        ...updateBody,
        updatedAt: dayjs().toISOString(),
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.allTasks });
    },
    meta: {
      type: "Edit",
      dataOf: "Task",
    },
  });
};
