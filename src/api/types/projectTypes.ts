export type Project = {
  id: string;
  name: string;
  description: string;
  status: keyof ProjectStatus;
  adminIds: number[];
  memberIds: number[];
  teamIds: number[];
  createdAt: string;
  updatedAt: string;
};

export type ProjectStatus = {
  active: string;
  paused: string;
  completed: string;
};
