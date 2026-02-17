import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useUserContext } from "../components/context/UserContext";

const withAuth = (Component: React.ComponentType) => {
  const AuthenticatedComponent = (props: any) => {
    const { currentUser, isCheckCompleted } = useUserContext();

    const navigate = useNavigate();

    const isAuthenticated = !!currentUser;

    useEffect(() => {
      if (!isAuthenticated && isCheckCompleted) {
        navigate("/auth/login");
      }
    }, [isAuthenticated, isCheckCompleted]);

    return <Component {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
