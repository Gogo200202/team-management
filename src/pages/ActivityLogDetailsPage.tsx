import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useGetAllActivityLog } from "../api/activityController";
import { useGetAllProjects } from "../api/projectController";
import { useGetAllTeams } from "../api/teamController";
import { useGetAllUsers } from "../api/user.controller";
import { CustomTimeLineComponent } from "../components/views/Activity/CustomTimeLineComponent";
import { createProjectActivityLogWithId } from "../utils/helpers/Activity/createProjectActivityLog";
import { createTaskActivityLogWithId } from "../utils/helpers/Activity/createTaskActivityLog";
import { createTeamActivityLogWithId } from "../utils/helpers/Activity/createTeamActivityLog";
import { createUserActivityLogWhitId } from "../utils/helpers/Activity/createUserActivityLog";

export const ActivityLogDetailsPage = () => {
  const { itemId, type } = useParams();
  const { data: allActivityLog, isSuccess } = useGetAllActivityLog();
  const { data: allUsers } = useGetAllUsers();
  const { data: allTeams } = useGetAllTeams();
  const { data: allProjects } = useGetAllProjects();

  const [itemLog, setItemLog] = useState();

  useEffect(() => {
    if (isSuccess) {
      if (type == "Team") {
        const teamLogResult = createTeamActivityLogWithId(
          allActivityLog,
          allUsers!,
          itemId!,
        );
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setItemLog(teamLogResult.reverse());
      } else if (type == "Project") {
        const projectResult = createProjectActivityLogWithId(
          allActivityLog,
          allTeams!,
          allUsers!,
          itemId!,
        );
        setItemLog(projectResult.reverse());
      } else if (type == "Task") {
        const task = createTaskActivityLogWithId(
          allActivityLog,
          allUsers!,
          allProjects!,
          itemId!,
        );
        setItemLog(task.reverse());
      }else if (type == "User") {
        const user = createUserActivityLogWhitId(
          allActivityLog,
          itemId!,
        );
        setItemLog(user.reverse());
      }
    }
  }, [allActivityLog, isSuccess]);

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h2" sx={{ textAlign: "center" }}>
        Activity Log Details
      </Typography>
      <CustomTimeLineComponent type={type!} itemLog={itemLog} />
    </Box>
  );
};
