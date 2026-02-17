import { useNavigate } from "react-router-dom";

import { useUserContext } from "../components/context/UserContext";

const RedirectRegisterUsers = (Component: React.ComponentType) => {
  const RedirectRegisterUsersComponents = (props: any) => {
    const navigate = useNavigate();
    const { currentUser } = useUserContext();
    const isAuthenticated = !!currentUser;

    if (isAuthenticated) {
      navigate("/");
    }

    return <Component {...props} />;
  };

  return RedirectRegisterUsersComponents;
};

export default RedirectRegisterUsers;
