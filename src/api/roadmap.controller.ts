import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { axiosClient } from "../config/axios.config";

export interface RoadmapTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  subtasks?: { id: string; title: string; completed: boolean }[];
}

export const useGetRoadmap = () => {
  return useQuery<RoadmapTask[]>({
    queryKey: ["roadmap"],
    queryFn: async () => {
      const { data } = await axiosClient.get("/roadmap");

      return data;
    },
  });
};

export const useUpdateRoadmapTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (task: Partial<RoadmapTask> & { id: string }) => {
      const { data } = await axiosClient.patch(`/roadmap/${task.id}`, task);
      return data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["roadmap"] });
    },
  });
};

export const useRoadmapController = () => {
  const { data: tasks = [], isLoading, error } = useGetRoadmap();
  const mutation = useUpdateRoadmapTask();

  const toggleTask = (task: RoadmapTask) => {
    if (task.subtasks && task.subtasks.length > 0) return;
    mutation.mutate({ id: task.id, completed: !task.completed });
  };

  const toggleSubTask = (task: RoadmapTask, subtaskId: string) => {
    if (!task.subtasks) return;

    const updatedSubtasks = task.subtasks.map((sub) =>
      sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub,
    );

    const allCompleted = updatedSubtasks.every((sub) => sub.completed);

    mutation.mutate({
      id: task.id,
      subtasks: updatedSubtasks,
      completed: allCompleted,
    });
  };

  return {
    tasks,
    isLoading,
    error,
    toggleTask,
    toggleSubTask,
  };
};
