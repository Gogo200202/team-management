import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  render,
  renderHook,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router-dom";

import {
  useCreateTeams,
  useDeleteTeam,
  useGetAllTeams,
  useUpdateTeam,
} from "../../api/teamController";
import TeamFormComponent from "../../components/views/Teams/TeamFormComponent";
import { TeamsPage } from "../../pages/TeamsPage";
import { mockCallback } from "../__mocks__/mockData";

const createWrapper = () => {
  const queryClient = new QueryClient({});
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("test mock data", () => {
  it("test all mock", () => {
    mockCallback(1);

    expect(mockCallback.mock.results[0].value).toBe(43);
  });
  it("All mock teams data teams", async () => {
    const { result } = renderHook(() => useGetAllTeams(), {
      wrapper: createWrapper(),
    });

    expect(result.current.data![0].name).toBe("Test team mock");
    expect(result.current.data![0].users).toStrictEqual(["1"]);
  });
});

describe("Teams crud operation", () => {
  let idOfTeam: string = "";

  it("Create team", async () => {
    const { result } = renderHook(() => useCreateTeams(), {
      wrapper: createWrapper(),
    });
    result.current.mutate({
      name: "Test Team",
      users: ["test1", "test2"],
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    idOfTeam = result.current.data.id;
    expect(result.current.data.name).toBe("Test Team");
  });

  it("Update team", async () => {
    const { result } = renderHook(() => useUpdateTeam(), {
      wrapper: createWrapper(),
    });
    result.current.mutate({
      id: idOfTeam,
      name: "Updated Test Team",
      users: ["test1", "test2", "test3"],
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data.name).toBe("Updated Test Team");
  });

  it("Delete team", async () => {
    const { result } = renderHook(() => useDeleteTeam(), {
      wrapper: createWrapper(),
    });
    result.current.mutate(idOfTeam);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});

describe("Teams page", () => {
  const routes = [
    {
      path: "/",
      element: (
        <QueryClientProvider client={new QueryClient({})}>
          <TeamsPage />
        </QueryClientProvider>
      ),
    },
  ];

  const router = createMemoryRouter(routes, {
    initialEntries: ["/"],
  });

  it("renders Teams page", async () => {
    render(<RouterProvider router={router} />);

    expect(await screen.findByText(/Teams Page/i)).toBeInTheDocument();
  });

  it("open team dialog", async () => {
    const user = userEvent.setup();
    render(<RouterProvider router={router} />);
    const button = screen.getByRole("button", { name: /Add new team/i });

    await user.click(button);

    expect(screen.getByText(/create team/i)).toBeVisible();
  });
  const TeamName: string = "test team";
  it("create team from form", async () => {
    const user = userEvent.setup();

    const routesForm = [
      {
        path: "/",
        element: (
          <QueryClientProvider client={new QueryClient({})}>
            <TeamFormComponent
              allUsers={[
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
              ]}
              openDialog={true}
              setOpenDialog={() => {}}
            />
          </QueryClientProvider>
        ),
      },
    ];

    const routerForm = createMemoryRouter(routesForm, {
      initialEntries: ["/"],
    });
    render(<RouterProvider router={routerForm} />);

    const nameInput = screen.getByLabelText(/Team Name/i);
    const autocomplete = screen.getByLabelText(/Select users/i);

    const submitButton = screen.getAllByText(/Agree/i)[1];

    await user.type(nameInput, TeamName);
    await user.click(autocomplete);

    const option = await screen.findByRole("option", { name: /Alice/i });
    await user.click(option);

    await user.click(submitButton);
  });

  it("delete button open dialog", async () => {
    render(<RouterProvider router={router} />);
    const user = userEvent.setup();

    const deleteButton = screen.getAllByRole("button", {
      name: /delete/i,
    })[0];

    await user.click(deleteButton);
    expect(screen.getByText(/Do you want to delete this team/i)).toBeVisible();
  });

  it("Fined mocked data in teams", () => {
    render(<RouterProvider router={router} />);
    const teamMokeData = screen.getByText(/Test team mock/i);

    expect(teamMokeData.innerHTML).toBe("Test team mock");
  });

  it("delete button action", async () => {
    render(<RouterProvider router={router} />);
    const user = userEvent.setup();
    const teamMokeData = screen.getByText(/Test team mock/i);
    const card = teamMokeData.parentElement;

    const deleteButton = within(card).getByRole("button", { name: /delete/i });

    await user.click(deleteButton);

    const dialog = screen.getByText(/Do you want to delete this team/i);

    expect(dialog).toBeVisible();

    const agreeButton = within(dialog.parentElement!).getByRole("button", {
      name: "Agree",
    });
    await user.click(agreeButton);
    expect(screen.getByText(/You perform delete action/i)).toBeVisible();
  });

  it("display new team", async () => {
    render(<RouterProvider router={router} />);
    expect(
      screen.getAllByText(new RegExp(TeamName, "i"))[
        screen.getAllByText(new RegExp(TeamName, "i")).length - 1
      ],
    ).toBeInTheDocument();
  });
});
