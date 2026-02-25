export type Task = {
  id: string;
  title: string;
  description: string;
  status: keyof typeof StatusTask;
  priority: keyof typeof PriorityTask;
  projectId: string;
  assignedUserId: string;
  reporterId: string;
  createdAt: string;
  updatedAt: string;
  finishUntil: string;
};

export const StatusTask = {
  todo: "",
  progress: "",
  complete: "",
};

export const PriorityTask = {
  low: "",
  high: "",
  medium: "",
};
