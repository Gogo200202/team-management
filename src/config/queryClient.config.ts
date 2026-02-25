import { MutationCache, QueryClient } from "@tanstack/query-core";

import { activityLogKey, createActivity } from "../api/activityController";
import type { ListTypeOfData } from "../api/types/activityLog";

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
  mutationCache: new MutationCache({
    onSuccess(data, _variables, _onMutateResult, _mutation, context) {
      createActivity({
        typeOfLogin: context.meta!.type as string,
        typeOfData: context.meta!.dataOf as ListTypeOfData,
        loggedInData: JSON.stringify(data),
      });
      queryClient.invalidateQueries({
        queryKey: activityLogKey.allActivityLog,
      });
    },
  }),
});
