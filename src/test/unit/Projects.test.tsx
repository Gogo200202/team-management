import {
  QueryClient,
  QueryClientProvider,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  createMemoryRouter,
  type RouteObject,
  RouterProvider,
} from "react-router-dom";

import {
  type CreateProject,
  useCreateProject,
} from "../../api/projectController";
import * as allProjects from "../../api/projectController";
import * as allTeamCrud from "../../api/teamController";
import type { Project } from "../../api/types/projectTypes";
import type { Team } from "../../api/types/teamTypes";
import type { User } from "../../api/types/userTypes";
import * as allUserCrud from "../../api/user.controller";
import ProjectPage from "../../pages/ProjectPage";

const mockDataTeam = {
  data: [
    {
      id: "8e9c",
      name: "Test team mock",
      users: ["1"],
      createdAt: "2026-03-02T13:41:24.290Z",
      updatedAt: "2026-03-02T13:41:24.290Z",
    },
    {
      id: "8e9c",
      name: "Test team mock 2",
      users: ["1"],
      createdAt: "2026-03-02T13:41:24.290Z",
      updatedAt: "2026-03-02T13:41:24.290Z",
    },
  ] as Team[],
  isLoading: false,
} as UseQueryResult<Team[]>;

const mockDataUsers = {
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
} as UseQueryResult<User[]>;

const mockDataProjects = {
  data: [
    {
      id: "123",
      name: "Test mock project",
      description: "Test mock project description",
      adminIds: ["1"],
      memberIds: ["1"],
      teamIds: ["8e9c"],
      status: "active",
      createdAt: "2025-01-10T10:00:00Z",
      updatedAt: "2025-01-10T10:00:00Z",
    },
  ] as Project[],
  isLoading: false,
} as UseQueryResult<Project[]>;

const queryClient = new QueryClient({});

const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <QueryClientProvider client={queryClient}>
        <ProjectPage />
      </QueryClientProvider>
    ),
  },
];

const router = createMemoryRouter(routes, {
  initialEntries: ["/"],
});

jest.spyOn(allProjects, "useGetAllProjects").mockReturnValue(mockDataProjects);

const createWrapper = () => {
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("Project page", () => {
  it("render project page", () => {
    render(<RouterProvider router={router} />);
  });
  it("check for correct data", () => {
    render(<RouterProvider router={router} />);
    const nameOfProject = screen.getByText(mockDataProjects.data![0].name);
    const status = screen.getByText(mockDataProjects.data![0].status);
    //screen.debug();
    expect(nameOfProject).toBeInTheDocument();
    expect(status).toBeInTheDocument();
  });
});

describe("Create Project", () => {
  it("Open dialog", async () => {
    render(<RouterProvider router={router} />);
    const user = userEvent.setup();
    const createDialog = screen.getByRole("button", {
      name: /Create project/i,
    });
    await user.click(createDialog);
    const dialog = screen.getByLabelText("Name of the project");
    expect(dialog).toBeVisible();
  });
  it("Create project", async () => {
    jest.spyOn(allUserCrud, "useGetAllUsers").mockReturnValue(mockDataUsers);
    jest.spyOn(allTeamCrud, "useGetAllTeams").mockReturnValue(mockDataTeam);

    render(<RouterProvider router={router} />);
    const user = userEvent.setup();
    const createDialog = screen.getByRole("button", {
      name: /Create project/i,
    });
    await user.click(createDialog);

    const nameOfProject = screen.getByLabelText("Name of the project");
    const description = screen.getByLabelText("Description of the project");
    const admins = screen.getByLabelText("Admins");
    const members = screen.getByLabelText("Members");
    const teams = screen.getByLabelText("Teams");
    const AgreeButton = screen.getByRole("button", { name: "Agree" });

    const teamAutoComplete = teams.parentElement?.parentElement?.parentElement;
    const adminAutoComplete =
      admins.parentElement?.parentElement?.parentElement;
    const membersAutoComplete =
      members.parentElement?.parentElement?.parentElement;

    await user.click(teamAutoComplete!);
    act(() => {
      fireEvent.change(teams, { target: { value: "Test team mock" } });
    });
    const optionTeams = screen.getByRole("option", {
      name: "Test team mock",
    });
    await user.click(optionTeams);

    await user.click(adminAutoComplete!);
    act(() => {
      fireEvent.change(admins, { target: { value: "Alice" } });
    });
    const optionAdmins = screen.getByRole("option", {
      name: "Alice Johnson",
    });
    await user.click(optionAdmins);

    await user.click(membersAutoComplete!);
    act(() => {
      fireEvent.change(members, { target: { value: "Alice" } });
    });
    const optionMember = screen.getByRole("option", {
      name: "Alice Johnson",
    });
    await user.click(optionMember);

    await user.type(nameOfProject, "Test mock project");

    await user.type(description, "Test mock project description");

    await user.click(AgreeButton);

    const spy = jest.spyOn(allProjects, "useCreateProject");

    await waitFor(() => expect(spy).toHaveBeenCalled());
  });

  it("Edit project", async () => {
    jest.spyOn(allUserCrud, "useGetAllUsers").mockReturnValue(mockDataUsers);
    jest.spyOn(allTeamCrud, "useGetAllTeams").mockReturnValue(mockDataTeam);

    render(<RouterProvider router={router} />);
    const user = userEvent.setup();

    const editButton = screen.getByRole("button", { name: /edit/i });
    await user.click(editButton);

    const nameOfProject = screen.getByLabelText("Name of the project");
    await user.type(nameOfProject, "Test mock project edit");
    const AgreeButton = screen.getByRole("button", { name: "Agree" });
    await user.click(AgreeButton);

    const spy = jest.spyOn(allProjects, "useCreateProject");

    await waitFor(() => expect(spy).toHaveBeenCalled());
  });
  it("delete project", async () => {
    jest.spyOn(allUserCrud, "useGetAllUsers").mockReturnValue(mockDataUsers);
    jest.spyOn(allTeamCrud, "useGetAllTeams").mockReturnValue(mockDataTeam);

    render(<RouterProvider router={router} />);
    const user = userEvent.setup();
    const projectToDeleteButton = within(
      screen.getByText("Test mock project").parentElement!,
    ).getByRole("button", { name: "delete" });
    await user.click(projectToDeleteButton);

    const deleteDialog = screen.getByText("Do you want to delete this project");
    screen.debug(deleteDialog);
    expect(deleteDialog).toBeVisible();
    const agreeButton = within(deleteDialog.parentElement).getByRole("button", {
      name: "Agree",
    });
    await user.click(agreeButton);
    expect(deleteDialog).not.toBeVisible();
  });
});
