import { Outlet, type RouteObject } from "react-router-dom";

import Layout from "../components/layout/Layout";
import RedirectRegisterUsers from "../middleware/RedirectRegisterUsers";
import withAuth from "../middleware/withAuth";
import { EditUserPage } from "./EditUserPage";
import ErrorPage from "./ErrorPage";
import { LogInPage } from "./LogInPage";
import ProjectPage from "./ProjectPage";
import ProjectPageDetail from "./ProjectPageDetail";
import { Register } from "./Register";
import { RoadmapPage } from "./RoadmapPage";
import { TeamsPage } from "./TeamsPage";

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
        element: <RoadmapPage />,
      },
      {
        path: "teams",
        element: <TeamsPage />,
      },
      {
        path: "edit",
        element: <EditUserPage />,
      },
      {
        path: "projects",
        element: <ProjectPage />,
      },
      {
        path: "projects/details/:projectsId",
        element: <ProjectPageDetail />,
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
