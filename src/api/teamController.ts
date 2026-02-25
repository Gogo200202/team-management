import { useMutation, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

import { axiosClient } from "../config/axios.config";
import { queryClient } from "../config/queryClient.config";
import type { Team } from "./types/teamTypes";

export const teamKeys = {
  allTeams: ["allTeams"],
  teamDetails: (teamId: number) => [
    teamKeys.allTeams,
    `teamsDetails-${teamId}`,
  ],
};

type CreateTeams = {
  name: string;
  users: string[];
};

export const useGetAllTeams = () => {
  return useQuery<Team[]>({
    queryKey: teamKeys.allTeams,
    queryFn: async () => {
      const { data } = await axiosClient.get(`/teams`);

      return data;
    },
  });
};

export const useCreateTeams = () => {
  return useMutation({
    mutationFn: async (createBody: CreateTeams) => {
      const { data } = await axiosClient.post("/teams", {
        ...createBody,
        createdAt: dayjs().toISOString(),
        updatedAt: dayjs().toISOString(),
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.allTeams });
    },
    meta: {
      type: "Create",
      dataOf: "Team",
    },
  });
};

export const useUpdateTeam = () => {
  return useMutation({
    mutationFn: async (data: Partial<Team>) => {
      const { data: updatedTeam } = await axiosClient.patch(
        `/teams/${data.id}`,
        {
          ...data,
          updatedAt: dayjs().toISOString(),
        },
      );
      return updatedTeam;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.allTeams });
    },
    meta: {
      type: "Edit",
      dataOf: "Team",
    },
  });
};

export const useDeleteTeam = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axiosClient.delete(`/teams/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.allTeams });
    },
    meta: {
      type: "Delete",
      dataOf: "Team",
    },
  });
};
