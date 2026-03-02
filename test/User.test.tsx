import { renderHook, waitFor } from "@testing-library/react";
import {
  useCreateUser,
  useDeleteUser,
  useEditUser,
  useGetAllUsers,
} from "../src/api/user.controller";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dayjs from "dayjs";
import { User } from "../src/api/types/userTypes";
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
