import { useMutation, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

import { axiosClient } from "../config/axios.config";
import { queryClient } from "../config/queryClient.config";
import type { ActivityLog } from "./types/activityLog";

export const activityLogKey = {
  allActivityLog: ["allActivityLog"],
  activityLogDetails: (allActivityLogId: string) => [
    activityLogKey.allActivityLog,
    `activityLogDetails-${allActivityLogId}`,
  ],
};

export const useGetAllActivityLog = () => {
  return useQuery<ActivityLog[]>({
    queryKey: activityLogKey.allActivityLog,
    queryFn: async () => {
      const { data } = await axiosClient.get(`/activity_log`);

      return data;
    },
  });
};

type CreateActivityLog = Omit<ActivityLog, "id" | "createdAt">;

export const useCreateActivityLog = () => {
  return useMutation({
    mutationFn: async (createBody: CreateActivityLog) => {
      const { data } = await axiosClient.post("/activity_log", {
        ...createBody,
        createdAt: dayjs().toISOString(),
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: activityLogKey.allActivityLog,
      });
    },
  });
};

export async function createActivity(createBody: CreateActivityLog) {
  const { data } = await axiosClient.post("/activity_log", {
    ...createBody,
    createdAt: dayjs().toISOString(),
  });

  return data;
}
