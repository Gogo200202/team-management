import { Outlet, type RouteObject } from "react-router-dom";
import { LandingPage } from "./LandingPage";
import { Layout } from "../components/layout/Layout";
import ErrorPage from "./ErrorPage";
import { TeamsPage } from "./TeamsPage";
import { LogInPage } from "./LogInPage";
import { Register } from "./Register";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
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
    element: <Outlet />,
    children: [
      {
        path: "login",
        element: <LogInPage />,
      },
      {
        path: "register",
        element: <Register />,
      }
    ],
  },
];
