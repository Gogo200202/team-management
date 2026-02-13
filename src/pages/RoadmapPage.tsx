import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  Alert,
  Box,
  Checkbox,
  Chip,
  CircularProgress,
  Collapse,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Snackbar,
  Typography,
} from "@mui/material";
import { type ReactNode, useState } from "react";

import { useRoadmapController } from "../api/roadmap.controller";

export const RoadmapPage = () => {
  const { tasks, isLoading, error, toggleTask, toggleSubTask } =
    useRoadmapController();

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [infoMessage, setInfoMessage] = useState<ReactNode>(null);

  const handleClose = () => {
    setInfoMessage(null);
  };

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const validatePreviousPhases = (
    currentIndex: number,
    isDeselect: boolean = false,
  ) => {
    if (isDeselect) {
      return true;
    }

    for (let i = 0; i < currentIndex; i++) {
      if (!tasks[i].completed) {
        setInfoMessage(
          <span>
            Please first complete: <strong>&quot;{tasks[i].title}&quot;</strong>
          </span>,
        );
        return false;
      }
    }
    return true;
  };

  return (
    <>
      <Box
        sx={{
          minHeight: "calc(100vh - 112px)",
          width: "100%",
          pb: 8,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ mb: 6, textAlign: "center" }}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#333" }}
            >
              Team Management App
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Development Roadmap & Progress
            </Typography>
          </Box>

          {error && (
            <Alert severity="warning" sx={{ mb: 4 }}>
              {error.message} - You can run: <code>npm run server</code>
            </Alert>
          )}

          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          ) : (
            <Paper elevation={4} sx={{ borderRadius: 2, overflow: "hidden" }}>
              <List disablePadding>
                {tasks.map((task, index) => (
                  <Box key={task.id}>
                    <ListItem disablePadding divider>
                      <ListItemButton
                        onClick={() => {
                          if (validatePreviousPhases(index)) {
                            toggleTask(task);
                          }
                        }}
                        sx={{ py: 2 }}
                      >
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            checked={task.completed}
                            tabIndex={-1}
                            disableRipple
                            disabled={
                              !!(task.subtasks && task.subtasks.length > 0)
                            }
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Typography
                                variant="subtitle1"
                                sx={{
                                  fontWeight: 600,
                                  textDecoration: task.completed
                                    ? "line-through"
                                    : "none",
                                  color: task.completed
                                    ? "text.disabled"
                                    : "text.primary",
                                }}
                              >
                                {task.title}
                              </Typography>
                              {task.completed && (
                                <Chip
                                  label="Done"
                                  color="success"
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                            </Box>
                          }
                          secondary={
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                mt: 0.5,
                                textDecoration: task.completed
                                  ? "line-through"
                                  : "none",
                              }}
                            >
                              {task.description}
                            </Typography>
                          }
                        />
                        {task.subtasks && task.subtasks.length > 0 && (
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpand(task.id);
                            }}
                          >
                            {expanded[task.id] ? (
                              <ExpandLess />
                            ) : (
                              <ExpandMore />
                            )}
                          </IconButton>
                        )}
                      </ListItemButton>
                    </ListItem>
                    {task.subtasks && (
                      <Collapse
                        in={expanded[task.id]}
                        timeout="auto"
                        unmountOnExit
                      >
                        <List
                          component="div"
                          disablePadding
                          sx={{ pl: 4, bgcolor: "#fafafa" }}
                        >
                          {task.subtasks.map((sub) => (
                            <ListItem key={sub.id} dense disablePadding>
                              <ListItemButton
                                onClick={() => {
                                  if (
                                    validatePreviousPhases(index, sub.completed)
                                  ) {
                                    toggleSubTask(task, sub.id);
                                  }
                                }}
                              >
                                <ListItemIcon>
                                  <Checkbox
                                    edge="start"
                                    checked={sub.completed}
                                    tabIndex={-1}
                                    disableRipple
                                  />
                                </ListItemIcon>
                                <ListItemText primary={sub.title} />
                              </ListItemButton>
                            </ListItem>
                          ))}
                        </List>
                      </Collapse>
                    )}
                  </Box>
                ))}
              </List>
            </Paper>
          )}
        </Container>
      </Box>

      <Snackbar
        open={!!infoMessage}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="warning" sx={{ width: "100%" }}>
          {infoMessage}
        </Alert>
      </Snackbar>
    </>
  );
};
