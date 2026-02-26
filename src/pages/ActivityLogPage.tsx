import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useGetAllActivityLog } from "../api/activityController";
import { useGetAllTeams } from "../api/teamController";
import { useGetAllUsers } from "../api/user.controller";
import {
  createProjectActivityLog,
  type ProjectActivityWithAllData,
} from "../utils/helpers/createProjectActivityLog";
import {
  createTeamsActivityLogs,
  type TeamActivityLog,
} from "../utils/helpers/createTeamActivityLog";

function ActivityLogPage() {
  const { data: allActivityLog, isSuccess } = useGetAllActivityLog();
  const { data: allUsers = [] } = useGetAllUsers();
  const { data: allTeams = [] } = useGetAllTeams();
  const navigate = useNavigate();
  const [teamsActivity, setTeamsActivity] = useState<TeamActivityLog[]>();
  const [projectActivity, setProjectActivity] =
    useState<ProjectActivityWithAllData[]>();

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
      console.log(projects);
      setTeamsActivity(teams.reverse());
      setProjectActivity(projects.reverse());
    }
  }, [isSuccess]);

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
              }}
            >
              <Stack>
                <Box>
                  {/* <Box>TeamId: {activity.loggedInData.id}</Box> */}
                  <Typography sx={{ fontSize: 20 }}>
                    Action: {activity.typeOfLogin}
                  </Typography>
                  <Typography sx={{ fontSize: 20 }}>
                    Team name: {activity.loggedInData.name}
                  </Typography>
                  <Typography sx={{ fontSize: 20 }}>
                    Users:{" "}
                    {activity.loggedInData.users.map((user, index) => (
                      <Fragment key={index}>{user.firstName} </Fragment>
                    ))}
                  </Typography>
                </Box>
              </Stack>

              <Button
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
              }}
            >
              <Stack>
                <Box>
                  {/* <Box>TeamId: {activity.loggedInData.id}</Box> */}
                  <Typography sx={{ fontSize: 20 }}>
                    Action: {pa.typeOfLogin}
                  </Typography>
                  <Typography sx={{ fontSize: 20 }}>
                    Team name: {pa.loggedInData.name}
                  </Typography>
                  <Stack>
                    <Box>
                      Admins:
                      {pa.loggedInData.admins.map((user, index) => (
                        <Fragment key={index}>{user.firstName} </Fragment>
                      ))}
                    </Box>
                    <Box>
                      Members:
                      {pa.loggedInData.members.map((user, index) => (
                        <Fragment key={index}>{user.firstName} </Fragment>
                      ))}
                    </Box>
                    <Box>
                      Teams:
                      {pa.loggedInData.teams.map((team, index) => (
                        <Fragment key={index}>{team.name} </Fragment>
                      ))}
                    </Box>
                  </Stack>
                </Box>
              </Stack>

              <Button
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
    </Box>
  );
}

export default ActivityLogPage;
