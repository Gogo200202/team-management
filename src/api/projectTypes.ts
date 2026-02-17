export type Project = {
  id: string;
  name: string;
  description: string;
  status: string;
  adminIds: number[];
  memberIds: number[];
  teamIds: number[];
  createdAt: string;
  updatedAt: string;
};
