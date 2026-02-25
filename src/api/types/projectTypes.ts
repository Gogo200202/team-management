export type Project = {
  id: string;
  name: string;
  description: string;
  status: keyof ProjectStatus;
  adminIds: string[];
  memberIds: string[];
  teamIds: string[];
  createdAt: string;
  updatedAt: string;
};

export type ProjectStatus = {
  active: string;
  paused: string;
  completed: string;
};
