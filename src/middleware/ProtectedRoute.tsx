import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import { useUserContext } from "../components/context/UserContext";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useUserContext();
  const navigate = useNavigate();
  const isAuthenticated = !!currentUser;

  if (!isAuthenticated) {
    navigate("/auth/login");
    return null;
  }

  return children;
};
