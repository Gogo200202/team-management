import type { UseQueryResult } from "@tanstack/react-query";

import * as allTeamCrud from "../../api/teamController";
import type { Team } from "../../api/types/teamTypes";
import type { User } from "../../api/types/userTypes";
import * as allUserCrud from "../../api/user.controller";
const mockDataTeam = {
  data: [
    {
      id: "8e9c",
      name: "Test team mock",
      users: ["1"],
      createdAt: "2026-03-02T13:41:24.290Z",
      updatedAt: "2026-03-02T13:41:24.290Z",
    },
  ] as Team[],
  isLoading: false,
  error: {},
} as UseQueryResult<Team[], Error>;

const mockDataUser = {
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
  ] as User[],
  isLoading: false,
  error: {},
} as UseQueryResult<User[], Error>;

export const mockCallback = jest.fn((x) => {
  return 42 + x;
});

jest.spyOn(allUserCrud, "useGetAllUsers").mockReturnValue(mockDataUser);
jest.spyOn(allTeamCrud, "useGetAllTeams").mockReturnValue(mockDataTeam);
