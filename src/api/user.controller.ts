import { useQuery, useMutation } from "@tanstack/react-query";
import { axiosClient } from "../config/axios.config";
import { queryClient } from "../config/queryClient.config";
import type { UserCreate } from "../utils/types/User";
import type { User } from "./userTypes";
import dayjs from "dayjs";

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

export const useGetUser = (userId: number) => {
  return useQuery<User>({
    queryKey: userKeys.userDetails(userId.toString()),
    queryFn: async () => {
      const { data } = await axiosClient.get(`/users/${userId}`);

      return data as User;
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

export const useEditUser = () => {
  return useMutation({
    mutationFn: async (user: User) =>
      await axiosClient.patch(`/users/${user.id}`, {
        ...user,
        updatedAt: dayjs().toISOString(),
      }),
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
