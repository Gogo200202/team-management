export type Task = {
  id: string;
  title: string;
  description: string;
  status: keyof StatusTask;
  priority: keyof PriorityTask;
  projectId: string;
  assignedUserId: string;
  createdAt: string;
  updatedAt: string;
};

type StatusTask = {
  todo: string;
  progress: string;
};

type PriorityTask = {
  low: string;
  high: string;
  medium: string;
};
