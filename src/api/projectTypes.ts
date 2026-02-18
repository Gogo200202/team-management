export type Project = {
  id: string;
  name: string;
  description: string;
  status: "active" | "paused" | "completed" | (string & {});
  adminIds: number[];
  memberIds: number[];
  teamIds: number[];
  createdAt: string;
  updatedAt: string;
};
