import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useGetAllActivityLog } from "../api/activityController";
import { useGetAllProjects } from "../api/projectController";
import { useGetAllTeams } from "../api/teamController";
import { useGetAllUsers } from "../api/user.controller";
import {
  createProjectActivityLog,
  type ProjectActivityWithAllData,
} from "../utils/helpers/createProjectActivityLog";
import {
  createTaskActivityLog,
  type ActivityWithTaskWithData,
} from "../utils/helpers/createTaskActivityLog";
import {
  createTeamsActivityLogs,
  type TeamActivityLog,
} from "../utils/helpers/createTeamActivityLog";

function ActivityLogPage() {
  const { data: allActivityLog, isSuccess } = useGetAllActivityLog();

  const { data: allUsers } = useGetAllUsers();
  const { data: allTeams } = useGetAllTeams();
  const { data: allProjects } = useGetAllProjects();
  const navigate = useNavigate();
  const [teamsActivity, setTeamsActivity] = useState<TeamActivityLog[]>([]);
  const [projectActivity, setProjectActivity] = useState<
    ProjectActivityWithAllData[]
  >([]);
  const [taskActivity, setTaskActivity] = useState<ActivityWithTaskWithData[]>(
    [],
  );

  useEffect(() => {
    if (isSuccess) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const teams = createTeamsActivityLogs(allActivityLog, allUsers);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const projects = createProjectActivityLog(
        allActivityLog,
        allTeams,
        allUsers,
      );

      const tasks = createTaskActivityLog(
        allActivityLog,
        allUsers,
        allProjects,
      );

      setTaskActivity(tasks.reverse());
      setTeamsActivity(teams.reverse());
      setProjectActivity(projects.reverse());
    }
  }, [allActivityLog, isSuccess]);

  const statusColors = new Map<string, any>();
  statusColors.set("Delete", <Chip label="Delete" color="error" />);
  statusColors.set("Edit", <Chip label="Edit" color="info" />);
  statusColors.set("Create", <Chip label="Create" color="success" />);

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h2" sx={{ textAlign: "center" }}>
        Activity Log Page
      </Typography>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontSize: 50 }}>Teams</Typography>
        </AccordionSummary>

        <AccordionDetails>
          {teamsActivity?.map((activity, index) => (
            <Box
              key={index}
              sx={{
                mb: 5,
                display: "flex",
                justifyContent: "space-between",

                borderRadius: 1,
              }}
            >
              <Stack>
                <Box>
                  <Box
                    sx={{
                      fontSize: 20,
                    }}
                  >
                    Action: {statusColors.get(activity.typeOfLogin)}
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      fontSize: 20,
                    }}
                  >
                    Team name:
                    <Box
                      sx={{
                        backgroundColor: `#${activity.loggedInData.id}`,
                        borderRadius: 2,
                      }}
                    >
                      {activity.loggedInData.name}
                    </Box>
                  </Box>
                  <Typography sx={{ fontSize: 20 }}>
                    Users:{" "}
                    {activity.loggedInData.users.map((user, index) => (
                      <Fragment key={index}>{user.firstName} </Fragment>
                    ))}
                  </Typography>
                </Box>
              </Stack>

              <Button
                sx={{ color: "white", backgroundColor: "transparent" }}
                endIcon={<ExitToAppIcon />}
                onClick={() =>
                  navigate(`/activity/details/Team/${activity.loggedInData.id}`)
                }
              >
                details
              </Button>
            </Box>
          ))}
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontSize: 50 }}>Projects</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {projectActivity?.map((pa, index) => (
            <Box
              key={index}
              sx={{
                mb: 5,
                display: "flex",
                justifyContent: "space-between",

                borderRadius: 1,
              }}
            >
              <Stack>
                <Box>
                  <Box
                    sx={{
                      fontSize: 20,
                    }}
                  >
                    Action: {statusColors.get(pa.typeOfLogin)}
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      fontSize: 20,
                    }}
                  >
                    <Box>Project name:</Box>{" "}
                    <Box
                      sx={{
                        borderRadius: 2,
                        backgroundColor: `#${pa.loggedInData.id}`,
                      }}
                    >
                      {pa.loggedInData.name}
                    </Box>
                  </Box>
                  <Stack>
                    <Box>
                      Admins:{" "}
                      {pa.loggedInData.admins.map((user, index) => (
                        <Fragment key={index}>{user.firstName} </Fragment>
                      ))}
                    </Box>
                    <Box>
                      Members:{" "}
                      {pa.loggedInData.members.map((user, index) => (
                        <Fragment key={index}>{user.firstName} </Fragment>
                      ))}
                    </Box>
                    <Box>
                      Teams:{" "}
                      {pa.loggedInData.teams.map((t, index) =>
                        t ? (
                          <Fragment key={index}>{t.name} </Fragment>
                        ) : (
                          <Box>error</Box>
                        ),
                      )}
                    </Box>
                  </Stack>
                </Box>
              </Stack>

              <Button
                sx={{ color: "white", backgroundColor: "transparent" }}
                endIcon={<ExitToAppIcon />}
                onClick={() =>
                  navigate(`/activity/details/Project/${pa.loggedInData.id}`)
                }
              >
                details
              </Button>
            </Box>
          ))}
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontSize: 50 }}>Task</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {taskActivity?.map((ta, index) => (
            <Box
              key={index}
              sx={{
                mb: 5,
                display: "flex",
                justifyContent: "space-between",

                borderRadius: 1,
              }}
            >
              <Stack>
                <Box>
                  <Box
                    sx={{
                      fontSize: 20,
                    }}
                  >
                    Action: {statusColors.get(ta.typeOfLogin)}
                  </Box>
                  <Box
                    sx={{
                      fontSize: 20,
                      display: "flex",
                    }}
                  >
                    <Box>Task title</Box>:
                    <Box
                      sx={{
                        borderRadius: 2,
                        backgroundColor: `#${ta.loggedInData.id}`,
                      }}
                    >
                      {ta.loggedInData.title}
                    </Box>
                  </Box>
                  <Stack>
                    <Box>
                      Assigned User: {ta.loggedInData.assignedUser.firstName}
                    </Box>
                    <Box>Reporter: {ta.loggedInData.reporter.firstName}</Box>
                    <Box>
                      Project:
                      {ta.loggedInData.project ? (
                        <>{ta.loggedInData.project.name}</>
                      ) : (
                        <>error</>
                      )}
                    </Box>
                  </Stack>
                </Box>
              </Stack>

              <Button
                sx={{ color: "white", backgroundColor: "transparent" }}
                endIcon={<ExitToAppIcon />}
                onClick={() =>
                  navigate(`/activity/details/Task/${ta.loggedInData.id}`)
                }
              >
                details
              </Button>
            </Box>
          ))}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

export default ActivityLogPage;
