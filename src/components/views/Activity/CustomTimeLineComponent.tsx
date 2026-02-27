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
import { Typography } from "@mui/material";
import dayjs from "dayjs";
import type { FunctionComponent } from "react";

import type { ProjectActivityWithAllData } from "../../../utils/helpers/createProjectActivityLog";
import type { TeamActivityLog } from "../../../utils/helpers/createTeamActivityLog";

interface ActionIcons {
  action: string;
}

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
export const CustomTimeLineComponent: FunctionComponent<{
  type: string;
  itemLog;
}> = ({ type, itemLog }) => {
  if (type == "Team") {
    const itemLogTeam = itemLog as TeamActivityLog[];
    return (
      <Timeline position="alternate">
        {itemLogTeam?.map((activity, index) => (
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
    );
  } else if (type == "Project") {
    const itemLogProject = itemLog as ProjectActivityWithAllData[];
    return (
      <Timeline position="alternate">
        {itemLogProject?.map((activity, index) => (
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
                Project {activity.loggedInData.name}
              </Typography>
              <Typography sx={{ fontSize: 20 }}>
                Admins:{" "}
                {activity.loggedInData.admins.map((admins) => (
                  <>
                    {admins.firstName} {admins.lastName} {admins.email},{" "}
                  </>
                ))}
              </Typography>
              <Typography sx={{ fontSize: 20 }}>
                Members:{" "}
                {activity.loggedInData.members.map((member) => (
                  <>
                    {member.firstName} {member.lastName} {member.email},{" "}
                  </>
                ))}
              </Typography>
              <Typography sx={{ fontSize: 20 }}>
                Team:{" "}
                {activity.loggedInData.teams.map((team) => (
                  <>{team.name}</>
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
    );
  }
  return <></>;
};
