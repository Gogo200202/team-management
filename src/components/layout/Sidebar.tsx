import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import SpaceDashboardOutlinedIcon from "@mui/icons-material/SpaceDashboardOutlined";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Toolbar,
} from "@mui/material";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const drawerWidth = 240;

const navItems = [
  { label: "Roadmap", path: "/", icon: <EventNoteOutlinedIcon /> },
  { label: "Teams", path: "/teams", icon: <GroupsOutlinedIcon /> },
  { label: "Projects", path: "/projects", icon: <AccountTreeOutlinedIcon /> },
  { label: "Activity log", path: undefined, icon: <QueryStatsIcon /> },
  { label: "Dashboard", path: undefined, icon: <SpaceDashboardOutlinedIcon /> },
];

export const Sidebar = () => {
  const [showInfo, setShowInfo] = useState(false);

  const handleClose = () => {
    setShowInfo(false);
  };

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {navItems.map((item) => (
              <ListItemButton
                key={item.label}
                component={NavLink}
                to={item.path || "/"}
                onClick={() => {
                  if (!item.path) {
                    setShowInfo(true);
                  }
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>

      <Snackbar
        open={showInfo}
        autoHideDuration={3000}
        onClose={handleClose}
        message="Page not yet implemented!"
      />
    </>
  );
};

export default Sidebar;
