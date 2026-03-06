import {
  QueryClient,
  QueryClientProvider,
  type UseQueryResult,
} from "@tanstack/react-query";
import { render, renderHook, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import dayjs from "dayjs";
import * as routerToSpy from "react-router";
import {
  createMemoryRouter,
  type RouteObject,
  RouterProvider,
} from "react-router-dom";

import type { User } from "../../api/types/userTypes";
import {
  useCreateUser,
  useDeleteUser,
  useEditUser,
  useGetAllUsers,
} from "../../api/user.controller";
import * as allUserCrud from "../../api/user.controller";
import {
  UserContext,
  UserProvider,
  type UserStored,
} from "../../components/context/UserContext";
import { EditUserPage } from "../../pages/EditUserPage";
import { LogInPage } from "../../pages/LogInPage";
import { Register } from "../../pages/Register";

const navigate = jest.fn();

jest.spyOn(routerToSpy, "useNavigate").mockImplementation(() => navigate);

const createWrapper = () => {
  const queryClient = new QueryClient({});
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
describe("User crud operation", () => {
  let idOfUser: string = "";
  it("all users", async () => {
    const { result } = renderHook(() => useGetAllUsers(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
  it("Create User", async () => {
    const { result } = renderHook(() => useCreateUser(), {
      wrapper: createWrapper(),
    });
    result.current.mutate({
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      secretWord: "test1234",
      displayName: "Test User",
      createdAt: dayjs().toISOString(),
      updatedAt: dayjs().toISOString(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    idOfUser = result.current.data!.id;
    expect(result.current.data!.firstName).toBe("Test");
  });

  it("Update user", async () => {
    const { result } = renderHook(() => useEditUser(), {
      wrapper: createWrapper(),
    });
    result.current.mutate({
      id: idOfUser,
      firstName: "Updated Test",
      lastName: "User",
      email: "updated@example.com",
      secretWord: "updated1234",
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data!.firstName).toBe("Updated Test");
  });

  it("Delete user", async () => {
    const { result } = renderHook(() => useDeleteUser(), {
      wrapper: createWrapper(),
    });
    result.current.mutate(idOfUser);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});

describe("User log in page", () => {
  const routes: RouteObject[] = [
    {
      path: "/logIn",
      element: (
        <QueryClientProvider client={new QueryClient({})}>
          <UserProvider>
            <LogInPage />
          </UserProvider>
        </QueryClientProvider>
      ),
    },
  ];

  const router = createMemoryRouter(routes, {
    initialEntries: ["/logIn"],
  });
  it("log in page render", () => {
    render(<RouterProvider router={router} />);
    const login = screen.getByText(/Log in/i);
    expect(login.innerHTML).toBe("Log in");
  });

  it("log in form validation email", async () => {
    const user = userEvent.setup();
    render(<RouterProvider router={router} />);

    const email = screen.getByLabelText("Email");
    const password = screen.getByLabelText("Password");
    const loginButton = screen.getByRole("button", { name: /log in/i });

    await user.type(email, "e something ");
    await user.type(password, "p something ");

    await user.click(loginButton);

    expect(screen.getByText(/Not valid email/i).innerHTML).toBe(
      "Not valid email",
    );
  });

  it("log in form validation password", async () => {
    const user = userEvent.setup();
    render(<RouterProvider router={router} />);

    const email = screen.getByLabelText("Email");
    const password = screen.getByLabelText("Password");
    const loginButton = screen.getByRole("button", { name: /log in/i });

    await user.type(email, "alice@example.com ");
    await user.type(password, "123");

    await user.click(loginButton);

    expect(
      screen.getByText(/Not valid password at least 4 characters/i).innerHTML,
    ).toBe("Not valid password at least 4 characters");
  });

  it("log in form successful log in", async () => {
    const user = userEvent.setup();
    render(<RouterProvider router={router} />);

    const email = screen.getByLabelText("Email");
    const password = screen.getByLabelText("Password");
    const loginButton = screen.getByRole("button", { name: /Log in/i });

    await user.type(email, "alice@example.com");
    await user.type(password, "123456789");

    await user.click(loginButton);

    expect(navigate).toHaveBeenCalledWith("/");
  });
});

describe("User register page", () => {
  const routes: RouteObject[] = [
    {
      path: "/register",
      element: (
        <QueryClientProvider client={new QueryClient({})}>
          <Register />
        </QueryClientProvider>
      ),
    },
  ];

  const router = createMemoryRouter(routes, {
    initialEntries: ["/register"],
  });

  it("render register page", () => {
    render(<RouterProvider router={router} />);
    const register = screen.getByText(/register/i);
    expect(register.innerHTML).toBe("Register");
  });

  it("register validation", async () => {
    render(<RouterProvider router={router} />);
    const user = userEvent.setup();
    const firstName = screen.getByLabelText("First name");
    const lastName = screen.getByLabelText("Last name");
    const email = screen.getByLabelText("Email");
    const password = screen.getByLabelText("Password");
    const reTryPassword = screen.getByLabelText("Retype password");

    await user.type(firstName, "a");
    await user.type(lastName, "a");
    await user.type(email, "a");
    await user.type(password, "a");
    await user.type(reTryPassword, "a");

    const allValidation = screen.getAllByText(
      "Name must have at least 4 characters",
    );
    const emailValidation = screen.getByText("Not valid email");
    const passwordValidation = screen.getByText(
      "Not valid password at least 4 characters",
    );

    expect(allValidation).toHaveLength(2);
    allValidation.map((x) => {
      expect(x).toBeVisible();
    });
    expect(emailValidation).toBeVisible();
    expect(passwordValidation).toBeVisible();
    //screen.debug();
  });

  it("register form", async () => {
    const spy = jest.spyOn(allUserCrud, "useCreateUser");

    render(<RouterProvider router={router} />);
    const user = userEvent.setup();
    const firstName = screen.getByLabelText("First name");
    const lastName = screen.getByLabelText("Last name");
    const email = screen.getByLabelText("Email");
    const password = screen.getByLabelText("Password");
    const reTryPassword = screen.getByLabelText("Retype password");
    const button = screen.getByRole("button", { name: "Register" });

    await user.type(firstName, "Test 123");
    await user.type(lastName, "test 123");
    await user.type(email, "asd@f.caasd");
    await user.type(password, "12345");
    await user.type(reTryPassword, "12345");

    await user.click(button);

    expect(spy).toHaveBeenCalled();
  });
});

describe("User edit page", () => {
  const routes: RouteObject[] = [
    {
      path: "/edit",
      element: (
        <QueryClientProvider client={new QueryClient({})}>
          <UserContext
            value={{
              isCheckCompleted: true,
              currentUser: {
                id: "1",
                userName: "test",
                email: "12qwes",
                secretWord: "asd",
              },
              handleLogin: function (data: UserStored): void {
                throw new Error("Function not implemented.");
              },
              handleLogOut: function (): void {
                throw new Error("Function not implemented.");
              },
            }}
          >
            <EditUserPage />
          </UserContext>
        </QueryClientProvider>
      ),
    },
  ];

  const router = createMemoryRouter(routes, {
    initialEntries: ["/edit"],
  });

  it("render edit page", () => {
    const mockDataUser = {
      data: {
        id: "1",
        displayName: "Alice Johnson",
        email: "alice@example.com",
        firstName: "Alice",
        lastName: "Johnson",
        createdAt: "2025-01-10T10:00:00Z",
        updatedAt: "2025-01-10T10:00:00Z",
        secretWord: "123456789",
      } as User,
      isLoading: false,
      error: {},
    } as UseQueryResult<User, Error>;

    jest.spyOn(allUserCrud, "useGetUser").mockReturnValue(mockDataUser);
    render(<RouterProvider router={router} />);

    const register = screen.getByText(/edit/i);
    screen.debug();
  });
});
