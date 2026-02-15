import { QueryCache, QueryClient } from "@tanstack/query-core";
import { teamKeys } from "../api/teamController";
import type { Team } from "../api/teamTypes";
export let lastChangeTeamAction: Team[] = [];
 let beforeChange: Team[] = [];
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      gcTime: 1000 * 60 * 5,
      staleTime: 1000 * 60 * 3,
      retry: 5,
      retryDelay: 1000 * 2,
    },
  },
  queryCache: new QueryCache({
    onSuccess: () => {
      lastChangeTeamAction=beforeChange
      const cachedData: Team[] = queryClient.getQueryData(teamKeys.allTeams);
      beforeChange = cachedData;
    },
  }),
});
