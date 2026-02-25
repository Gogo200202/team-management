import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

import { useGetAllActivityLog } from "../api/activityController";
import type { ActivityLog } from "../api/types/activityLog";
import type { Team } from "../api/types/teamTypes";
import type { User } from "../api/types/userTypes";
import { useGetAllUsers } from "../api/user.controller";

type TeamWithUsers = Omit<Team, "users"> & {
  users: User[];
};

type TeamTypeOfLog = Omit<ActivityLog, "loggedInData"> & {
  team: Team;
};
type TeamActivityLog = Omit<ActivityLog, "loggedInData"> & {
  loggedInData: TeamWithUsers;
};

function ActivityLogPage() {
  const { data: allActivityLog = [], isSuccess } = useGetAllActivityLog();
  const { data: allUsers } = useGetAllUsers();
  const [teamsActivity, setTeamsActivity] = useState<TeamActivityLog[]>();
  useEffect(() => {
    if (isSuccess) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const teams: TeamActivityLog[] = allActivityLog
        .filter((x) => x.typeOfData == "Team")
        .map((x) => {
          return {
            createdAt: x.createdAt,
            id: x.id,
            typeOfData: x.typeOfData,
            typeOfLogin: x.typeOfLogin,
            team: JSON.parse(x.loggedInData) as Team,
          } as TeamTypeOfLog;
        })
        .map((i) => {
          const users: User[] = i.team.users.map((userId) => {
            const resultUser = allUsers?.find((g) => g.id == userId);
            if (resultUser != undefined) {
              return resultUser;
            }
          });
          const team: TeamWithUsers = {
            users: users,
            createdAt: i.team.createdAt,
            id: i.team.id,
            name: i.team.name,
            updatedAt: i.team.updatedAt,
          };
          return {
            id: i.id,
            loggedInData: team,
            createdAt: i.createdAt,
            typeOfData: i.typeOfData,
            typeOfLogin: i.typeOfLogin,
          };
        });
      setTeamsActivity(teams.reverse());
    }
  }, [allActivityLog, allUsers, isSuccess]);

  return (
    <Box sx={{ width: "100%" }}>
      Activity Log Page
      <Box>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography component="span">Teams</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {teamsActivity?.map((team) => (
              <Stack>
                <Box>Type of log: {team.typeOfLogin}</Box>
                <Box>Team:Name: {team.loggedInData.name}</Box>
                <Box>
                  Users is team:{" "}
                  {team.loggedInData.users.map((user) => (
                    <>{user.firstName} </>
                  ))}
                </Box>
              </Stack>
            ))}
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
}

export default ActivityLogPage;
