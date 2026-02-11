import { Outlet, type RouteObject } from "react-router-dom";
import { LandingPage } from "./LandingPage";
import ErrorPage from "./ErrorPage";
import { TeamsPage } from "./TeamsPage";
import { LogInPage } from "./LogInPage";
import { Register } from "./Register";
import withAuth from "../middleware/withAuth";
import Layout from "../components/layout/Layout";
import RedirectRegisterUsers from "../middleware/RedirectRegisterUsers";

const LayoutComponent = withAuth(Layout);
const OutletLogInCheck = RedirectRegisterUsers(Outlet);

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <LayoutComponent />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "teams",
        element: <TeamsPage />,
      },
    ],
  },
 {
    path: "/auth",
    element: <OutletLogInCheck />,
    children: [
      {
        path: "login",
        element: <LogInPage />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
];
