import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useGetAllActivityLog } from "../api/activityController";
import { useGetAllProjects } from "../api/projectController";
import { useGetAllTeams } from "../api/teamController";
import type { ActivityLog } from "../api/types/activityLog";
import type { User } from "../api/types/userTypes";
import { useGetAllUsers } from "../api/user.controller";
import { CustomTimeLineComponent } from "../components/views/Activity/CustomTimeLineComponent";
import {
  createProjectActivityLogWithId,
  type ProjectActivityWithAllDataWithUpdate,
  type ProjectWithData,
} from "../utils/helpers/Activity/createProjectActivityLog";
import {
  type ActivityWithTaskWithDataAndUpdate,
  createTaskActivityLogWithId,
  type TaskWithData,
} from "../utils/helpers/Activity/createTaskActivityLog";
import {
  createTeamActivityLogWithId,
  type TeamActivityLogWithUpdates,
  type TeamWithUsers,
} from "../utils/helpers/Activity/createTeamActivityLog";
import {
  createUserActivityLogWhitId,
  type UpdatedActivityLogUser,
} from "../utils/helpers/Activity/createUserActivityLog";

type LoggedInDataAll = User & TeamWithUsers & TaskWithData & ProjectWithData;
export type ActivityLogInterface = Omit<ActivityLog, "loggedInData"> & {
  loggedInData: LoggedInDataAll;
  update: string;
};

export const ActivityLogDetailsPage = () => {
  const { itemId, type } = useParams();
  const { data: allActivityLog, isSuccess } = useGetAllActivityLog();
  const { data: allUsers } = useGetAllUsers();
  const { data: allTeams } = useGetAllTeams();
  const { data: allProjects } = useGetAllProjects();

  const [itemLog, setItemLog] = useState<
    (
      | TeamActivityLogWithUpdates
      | ProjectActivityWithAllDataWithUpdate
      | ActivityWithTaskWithDataAndUpdate
      | UpdatedActivityLogUser
    )[]
  >([]);

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
      } else if (type == "User") {
        const user = createUserActivityLogWhitId(allActivityLog, itemId!);
        setItemLog(user.reverse());
      }
    }
  }, [allActivityLog, isSuccess]);

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h2" sx={{ textAlign: "center" }}>
        Activity Log Details
      </Typography>
      <CustomTimeLineComponent itemLog={itemLog as ActivityLogInterface[]} />
    </Box>
  );
};
