import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  act,
  fireEvent,
  render,
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

import * as allProjects from "../../api/projectController";
import ProjectPage from "../../pages/ProjectPage";
import { mockDataProjects } from "../__mocks__/mockData";

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
    render(<RouterProvider router={router} />);
    const user = userEvent.setup();
    const projectToDeleteButton = within(
      screen.getByText("Test mock project").parentElement!,
    ).getByRole("button", { name: "delete" });
    await user.click(projectToDeleteButton);

    const deleteDialog = screen.getByText("Do you want to delete this project");
    screen.debug(deleteDialog);
    expect(deleteDialog).toBeVisible();
    const agreeButton = within(deleteDialog.parentElement!).getByRole(
      "button",
      {
        name: "Agree",
      },
    );
    await user.click(agreeButton);
    expect(deleteDialog).not.toBeVisible();
  });
});
