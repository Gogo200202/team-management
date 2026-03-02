import {
  render,
  screen,
  fireEvent,
  renderHook,
  waitFor,
} from "@testing-library/react";
import { TeamsPage } from "../src/pages/TeamsPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGetAllTask } from "../src/api/taskController";
import { useCreateTeams, useDeleteTeam, useGetAllTeams, useUpdateTeam } from "../src/api/teamController";

const createWrapper = () => {
  const queryClient = new QueryClient({});
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}
      
    
    </QueryClientProvider>
  );
};

describe("Jest start", () => {
  it("test jest", () => {
    expect(1).toBe(1);
  });
});

describe("Teams crud operation", () => {
  let idOfTeam: string="";
  it("GetAllTeams", async () => {
    const { result } = renderHook(() => useGetAllTeams(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    
    expect(result.current.data).toHaveLength(0);

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

