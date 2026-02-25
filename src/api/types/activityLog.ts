export type ActivityLog = {
  id: string;
  typeOfLogin: string;
  typeOfData: ListTypeOfData;
  loggedInData: string;
  createdAt: string;
};

export type ListTypeOfData = "User" | "Team" | "Task" | "Project";
