import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import ContentWrapper from "./ContentWrapper";
import ErrorBoundary from "./ErrorBoundary";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const drawerWidth = 240;

export const Layout = () => {
  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <Topbar />

      <Sidebar />

      <ContentWrapper drawerWidth={drawerWidth}>
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </ContentWrapper>
    </Box>
  );
};

export default Layout;
