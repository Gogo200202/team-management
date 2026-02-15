import { axiosClient } from "../config/axios.config";
import { queryClient } from "../config/queryClient.config";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { Team } from "./teamTypes";
import dayjs from "dayjs";

export const teamKeys = {
  allTeams: ["allTeams"],
  teamDetails: (teamId: number) => [
    teamKeys.allTeams,
    `teamsDetails-${teamId}`,
  ],
};

type createTeams = {
  name: string;
  users: number[];
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
    mutationFn: async (createBody: createTeams) => {
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
  });
};

export const useUpdateTeam = () => {
  return useMutation({
    mutationFn: async (data: Partial<Team>) =>
      await axiosClient.patch(`/teams/${data.id}`, {
        ...data,
        updatedAt: dayjs().toISOString(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.allTeams });
    },
  });
};

export const useDeleteTeam = () => {
  return useMutation({
    mutationFn: async (id: number) => await axiosClient.delete(`/teams/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.allTeams });
    },
  });
};

