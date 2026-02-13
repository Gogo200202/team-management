import type { RouteObject } from "react-router-dom";

import { Layout } from "../components/layout/Layout";
import ErrorPage from "./ErrorPage";
import { RoadmapPage } from "./RoadmapPage";
import { TeamsPage } from "./TeamsPage";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <RoadmapPage />,
      },
      {
        path: "/teams",
        element: <TeamsPage />,
      },
    ],
  },
];
