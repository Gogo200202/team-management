import { redirect } from "react-router-dom";
import { useUserContext } from "../components/context/UserContext";

// ! Check
const withAuth = (Component: any) => {
  const AuthenticatedComponent = (props) => {
    const { currentUser } = useUserContext();
    const isAuthenticated = !!currentUser;

    if (!isAuthenticated) {
      redirect("/auth/login");
      return null;
    }

    return <Component {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
