import { axiosClient } from "../config/axios.config";
import { queryClient } from "../config/queryClient.config";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { Team } from "./teamTypes";

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
  createdAt: string;
  updatedAt: string;
};

export const useGetAllTeams = () => {
  return useQuery<Team[]>({
    queryKey: [teamKeys.allTeams],
    queryFn: async () => {
      const { data } = await axiosClient.get(`/teams`);

      return data;
    },
  });
};

export const useCreateTeams = () => {
  return useMutation({
    mutationFn: async (data: createTeams) =>
      await axiosClient.post("/teams", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.allTeams });
    },
  });
};
