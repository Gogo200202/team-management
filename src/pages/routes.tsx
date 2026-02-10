import { Outlet, type RouteObject } from "react-router-dom";
import { LandingPage } from "./LandingPage";
import ErrorPage from "./ErrorPage";
import { TeamsPage } from "./TeamsPage";
import { LogInPage } from "./LogInPage";
import { Register } from "./Register";
import withAuth from "../middleware/withAuth";
import Layout from "../components/layout/Layout";
import { ProtectedRoute } from "../middleware/ProtectedRoute";

const LayoutComponent = withAuth(Layout);

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <LayoutComponent />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <LandingPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "teams",
        element: <TeamsPage />,
      },
    ],
  },
  // Wrapper to check if there is logged in user -> No Keep the page, NO: Redirect to home
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
      },
    ],
  },
];
