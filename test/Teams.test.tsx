import {
  render,
  screen,
  fireEvent,
  renderHook,
  waitFor,
  within,
} from "@testing-library/react";
import { TeamsPage } from "../src/pages/TeamsPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGetAllTask } from "../src/api/taskController";
import {
  useCreateTeams,
  useDeleteTeam,
  useGetAllTeams,
  useUpdateTeam,
} from "../src/api/teamController";
import {
  createBrowserRouter,
  createMemoryRouter,
  MemoryRouter,
  RouterProvider,
} from "react-router-dom";
import { routes } from "../src/pages/routes";
import userEvent from "@testing-library/user-event";
import TeamFormComponent from "../src/components/views/Teams/TeamFormComponent";
import { SetStateAction } from "react";
const router = createBrowserRouter(routes);
const createWrapper = () => {
  const queryClient = new QueryClient({});
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("Jest start", () => {
  it("test jest", () => {
    expect(1).toBe(1);
  });
});

describe("Teams crud operation", () => {
  let idOfTeam: string = "";
  it("GetAllTeams", async () => {
    const { result } = renderHook(() => useGetAllTeams(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
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
  it("open team details", async () => {
    const user = userEvent.setup();
    render(<RouterProvider router={router} />);
    const button = screen.getByRole("button", { name: /Add new team/i });

    await user.click(button);

    expect(screen.getByText(/create team/i)).toBeVisible();
  });
 let TeamName: string = "test team";
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

  it("display new team", async () => {
    const user = userEvent.setup();
    render(<RouterProvider router={router} />);
   expect(screen.getAllByText(new RegExp(TeamName, "i"))[screen.getAllByText(new RegExp(TeamName, "i")).length - 1]).toBeInTheDocument();
  });
});
