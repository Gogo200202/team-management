import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as Router from "react-router";
import { createMemoryRouter, RouterProvider } from "react-router-dom";

import * as ProjectCrud from "../../api/projectController";
import * as UserContextMock from "../../components/context/UserContext";
import ProjectPageDetail from "../../pages/ProjectPageDetail";
import {
  mockDataProject,
  mockDataTask,
  mockDataTeam,
} from "../__mocks__/mockData";

beforeEach(() => {
  jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useParams: jest.fn(),
  }));
});

const routes = [
  {
    path: "/",
    element: (
      <QueryClientProvider client={new QueryClient({})}>
        <ProjectPageDetail />
      </QueryClientProvider>
    ),
  },
];

const urlParams = jest
  .spyOn(Router, "useParams")
  .mockReturnValue({ projectsId: mockDataTask.projectId });

const router = createMemoryRouter(routes, {
  initialEntries: ["/"],
});

describe("Task page", () => {
  test("render page", async () => {
    const projectMock = jest
      .spyOn(ProjectCrud, "useGetProject")
      .mockReturnValue(mockDataProject);

    render(<RouterProvider router={router} />);

    expect(urlParams).toHaveBeenCalled();
    expect(projectMock).toHaveBeenCalledWith(mockDataTask.projectId);

    const name = screen.getByText(/Page Detail for/i);
    expect(name.innerHTML).toBe(
      "Page Detail for " + mockDataProject.data?.name,
    );
    expect(screen.getAllByText(/Alice/i)[0]).toBeInTheDocument();
    const team = screen.getByText(mockDataTeam.data![0].name);
    expect(team.innerHTML).toContain(mockDataTeam.data![0].name);

    const gridcell = await screen.findAllByRole("gridcell");
    expect(gridcell).toHaveLength(18);
  });
});

describe("Task crud", () => {
  it("Create task", async () => {
    const projectMock = jest
      .spyOn(ProjectCrud, "useGetProject")
      .mockReturnValue(mockDataProject);
    jest.spyOn(UserContextMock, "useUserContext").mockReturnValue({
      isCheckCompleted: true,
      currentUser: {
        id: "2",
        userName: "Moke user",
        email: "mock@example.com",
        secretWord: "123456789",
      },
      handleLogin: function (data: UserContextMock.UserStored): void {
        throw new Error("Function not implemented.");
      },
      handleLogOut: function (): void {
        throw new Error("Function not implemented.");
      },
    });

    render(<RouterProvider router={router} />);
    const user = userEvent.setup();

    expect(urlParams).toHaveBeenCalled();
    expect(projectMock).toHaveBeenCalledWith(mockDataTask.projectId);

    const createTaskButton = screen.getByRole("button", {
      name: /create task/i,
    });
    screen.debug(createTaskButton);
    await user.click(createTaskButton);
    const formTask =
      screen.getByLabelText("Title").parentElement?.parentElement?.parentElement
        ?.parentElement?.parentElement;

    expect(formTask).toBeVisible();
    const title = within(formTask!).getByLabelText("Title");
    const selectUser = within(formTask!).getByLabelText("Select user");
    const description = within(formTask!).getByLabelText("Description");
    const status = within(formTask!).getAllByText(/Status/i)[0].parentElement;
    const finishUntil = within(formTask!).getAllByText("Finish until")[0];
    const agreeButton = within(formTask!).getAllByText("Agree")[0];

    await user.type(title, "Create mock task");
    await user.type(description, "Create mock task description");

    await user.click(selectUser);

    const optionUser = await screen.findByRole("option", { name: /Alice/i });
    await user.click(optionUser);

    await user.click(agreeButton);
    const mokeTask = screen.getByText("Create mock task");
    expect(mokeTask).toBeInTheDocument();
  });
});
