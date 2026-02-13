import { axiosClient } from "../config/axios.config";
import { queryClient } from "../config/queryClient.config";
import type { UserCreate } from "../utils/types/User";
import type { User } from "./userTypes";
import { useMutation, useQuery } from "@tanstack/react-query";

export const userKeys = {
  allUsers: ["allUsers"],
  userDetails: (userId: number) => [userKeys.allUsers, `userDetails-${userId}`],
};

export const useGetAllUsers = () => {
  return useQuery<User[]>({
    queryKey: userKeys.allUsers,
    queryFn: async () => {
      const { data } = await axiosClient.get(`/users`);

      return data;
    },
  });
};

export const useCreateUser = () => {
  return useMutation({
    mutationFn: async (data: UserCreate) =>
      await axiosClient.post("/users", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.allUsers });
    },
  });
};

export const useDeleteUser = () => {
  return useMutation({
    mutationFn: async (id: number) => await axiosClient.delete(`/users${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.allUsers });
    },
  });
};
