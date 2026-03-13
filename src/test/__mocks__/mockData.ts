import type { UseQueryResult } from "@tanstack/react-query";
import { data } from "react-router-dom";

import * as allProjects from "../../api/projectController";
import * as TaskCrud from "../../api/taskController";
import * as allTeamCrud from "../../api/teamController";
import type { Project } from "../../api/types/projectTypes";
import type { Task } from "../../api/types/taskType";
import type { Team } from "../../api/types/teamTypes";
import type { User } from "../../api/types/userTypes";
import * as allUserCrud from "../../api/user.controller";

export const mockDataTeam = {
  data: [
    {
      id: "8e9c",
      name: "Test team mock",
      users: ["1"],
      createdAt: "2026-03-02T13:41:24.290Z",
      updatedAt: "2026-03-02T13:41:24.290Z",
    },
    {
      id: "8e7c",
      name: "Test team mock 2",
      users: ["1"],
      createdAt: "2026-03-02T13:41:24.290Z",
      updatedAt: "2026-03-02T13:41:24.290Z",
    },
  ] as Team[],
  isLoading: false,
} as UseQueryResult<Team[]>;

export const mockDataUsers = {
  data: [
    {
      id: "1",
      displayName: "Alice Johnson",
      email: "alice@example.com",
      firstName: "Alice",
      lastName: "Johnson",
      createdAt: "2025-01-10T10:00:00Z",
      updatedAt: "2025-01-10T10:00:00Z",
      secretWord: "123456789",
    },
    {
      id: "2",
      displayName: "Moke user",
      email: "mock@example.com",
      firstName: "Moke",
      lastName: "user",
      createdAt: "2025-01-10T10:00:00Z",
      updatedAt: "2025-01-10T10:00:00Z",
      secretWord: "123456789",
    },
  ] as User[],
  isLoading: false,
} as UseQueryResult<User[], Error>;

export const mockDataProject = {
  data: {
    id: "9ce8",
    name: "Test mock project",
    description: "Test mock project description",
    adminIds: ["1"],
    memberIds: ["1"],
    teamIds: ["8e9c"],
    status: "active",
    createdAt: "2025-01-10T10:00:00Z",
    updatedAt: "2025-01-10T10:00:00Z",
  },
  isFetched: true,
} as UseQueryResult<Project, Error>;

export const mockDataProjects = {
  data: [mockDataProject] as Project[],
  isLoading: false,
} as UseQueryResult<Project[]>;

export const mockDataTask = {
  id: "123",
  title: "test task mocked",
  assignedUserId: "1",
  description: "test task mocked description",
  status: "progress",
  priority: "high",
  projectId: "9ce8",
  reporterId: "1",
  finishUntil: "2026-02-27T22:00:00.000Z",
  createdAt: "2026-02-24T08:58:32.891Z",
  updatedAt: "2026-02-24T09:03:54.255Z",
} as Task;

export const mockDataTasks = {
  data: [
    mockDataTask,
    {
      id: "123",
      title: "test task mocked 2",
      assignedUserId: "1",
      description: "test task mocked description 2",
      status: "complete",
      priority: "low",
      projectId: "9ce8",
      reporterId: "1",
      finishUntil: "2026-02-27T22:00:00.000Z",
      createdAt: "2026-02-24T08:58:32.891Z",
      updatedAt: "2026-02-24T09:03:54.255Z",
    },
  ] as Task[],
} as UseQueryResult<Task[]>;

export const mockCallback = jest.fn((x) => {
  return 42 + x;
});

beforeAll(() => {
  jest.spyOn(allUserCrud, "useGetAllUsers").mockReturnValue(mockDataUsers);
  jest.spyOn(allTeamCrud, "useGetAllTeams").mockReturnValue(mockDataTeam);
  jest.spyOn(TaskCrud, "useGetAllTask").mockReturnValue(mockDataTasks);
  jest
    .spyOn(allProjects, "useGetAllProjects")
    .mockReturnValue(mockDataProjects);
});
