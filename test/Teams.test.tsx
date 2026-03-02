import { render, screen, fireEvent, renderHook, waitFor } from "@testing-library/react";
import {  TeamsPage} from "../src/pages/TeamsPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGetAllTask } from "../src/api/taskController";
import { useGetAllTeams } from "../src/api/teamController";


// Helper function to create a fresh provider for each test
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false }, // Turn off retries to speed up tests
    },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("Jest start", () => {
  it("test jest", () => {
    expect(1).toBe(1);
  });
  
});


describe("Teams", () => {
  it("renders the TeamsPage component", async () => {
    const { result } = renderHook(() => useGetAllTeams(), {
    wrapper: createWrapper(),
  });

  // Initially, it should be in a loading state
  expect(result.current.isLoading).toBe(true);

  // Wait for the query to resolve
  await waitFor(() => expect(result.current.isSuccess).toBe(true));

  expect(result.current.data![0].id).toEqual("aec6");
  });
});
