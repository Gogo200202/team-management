import { useMutation, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

import { axiosClient } from "../config/axios.config";
import { queryClient } from "../config/queryClient.config";
import type { UserCreate } from "../utils/types/User";
import type { User, UserModifyPayload } from "./userTypes";

export const userKeys = {
  allUsers: ["allUsers"],
  userDetails: (userId: string) => [userKeys.allUsers, `userDetails-${userId}`],
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

export const useGetUser = (userId: string) => {
  return useQuery<User>({
    queryKey: userKeys.userDetails(userId),
    queryFn: async () => {
      const { data } = await axiosClient.get(`/users/${userId}`);
      return data as User;
    },
  });
};

export const useCreateUser = () => {
  return useMutation({
    mutationFn: async (data: UserCreate) => {
      const { data: createdUser } = await axiosClient.post("/users", data);
      return createdUser;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.allUsers });
    },
  });
};

export const useEditUser = () => {
  return useMutation({
    mutationFn: async (user: UserModifyPayload) => {
      const { data: updatedUser } = await axiosClient.patch(
        `/users/${user.id}`,
        {
          ...user,
          displayName: user.firstName + " " + user.lastName,
          updatedAt: dayjs().toISOString(),
        },
      );
      return updatedUser;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.allUsers });
    },
  });
};

export const useDeleteUser = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      const { data: deletedUser } = await axiosClient.delete(`/users${id}`);
      return deletedUser;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.allUsers });
    },
  });
};
