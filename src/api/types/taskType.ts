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
  finishUntil: string;
};

export type StatusTask = {
  todo: string;
  progress: string;
  complete: string;
};

export type PriorityTask = {
  low: string;
  high: string;
  medium: string;
};
