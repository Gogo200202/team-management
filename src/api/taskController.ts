import { useQuery } from "@tanstack/react-query";

import { axiosClient } from "../config/axios.config";
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
