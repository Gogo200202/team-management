import type { ReactNode } from "react";
import { redirect } from "react-router-dom";
import { useUserContext } from "../components/context/UserContext";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useUserContext();
  const isAuthenticated = !!currentUser;

  if (!isAuthenticated) {
    redirect("/auth/login");
    return null;
  }

  return children;
};
