import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import Timeline from "@mui/lab/Timeline";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import { type FunctionComponent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useGetAllActivityLog } from "../api/activityController";
import { useGetAllUsers } from "../api/user.controller";
import {
  createTeamActivityLogWithId,
  type TeamActivityLog,
} from "../utils/helpers/createTeamActivityLog";

interface ActionIcons {
  action: string;
}

export const ActivityLogDetailsPage = () => {
  const { itemId, type } = useParams();
  const { data: allActivityLog, isSuccess } = useGetAllActivityLog();
  const { data: allUsers } = useGetAllUsers();
  const [itemLog, setItemLog] = useState<TeamActivityLog[]>();

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
      }
    }
  }, [isSuccess]);

  const IconIfAction: FunctionComponent<ActionIcons> = ({ action }) => {
    if (action == "Delete") {
      return (
        <TimelineDot color="error">
          <DeleteForeverIcon fontSize="large" />
        </TimelineDot>
      );
    } else if (action == "Create") {
      return (
        <TimelineDot color="success">
          <CheckCircleIcon fontSize="large" />
        </TimelineDot>
      );
    }
    return (
      <TimelineDot color="info">
        <EditIcon fontSize="large" />
      </TimelineDot>
    );
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h2" sx={{ textAlign: "center" }}>
        Activity Log Details
      </Typography>

      <Timeline position="alternate">
        {itemLog?.map((activity, index) => (
          <TimelineItem key={index}>
            <TimelineOppositeContent
              sx={{ m: "auto 0", fontSize: 20 }}
              variant="body2"
              color="text.secondary"
            >
              {dayjs(activity.createdAt).format("MM/DD/YYYY")}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineConnector />
              <IconIfAction action={activity.typeOfLogin} />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ py: "12px", px: 2 }}>
              <Typography sx={{ fontSize: 40 }}>
                Team {activity.loggedInData.name}
              </Typography>
              <Typography sx={{ fontSize: 20 }}>
                Users:{" "}
                {activity.loggedInData.users.map((user) => (
                  <>
                    {user.firstName} {user.lastName} {user.email},{" "}
                  </>
                ))}
              </Typography>
              <Typography sx={{ fontSize: 20 }}>
                created at:{" "}
                {dayjs(activity.loggedInData.createdAt).format("MM/DD/YYYY")}
              </Typography>
              <Typography sx={{ fontSize: 20 }}>
                updated at:{" "}
                {dayjs(activity.loggedInData.updatedAt).format("MM/DD/YYYY")}
              </Typography>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Box>
  );
};
