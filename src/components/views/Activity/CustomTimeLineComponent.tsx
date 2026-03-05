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
import type { FunctionComponent, ReactElement } from "react";

import type { Team } from "../../../api/types/teamTypes";
import type { User } from "../../../api/types/userTypes";
import type { ActivityLogInterface } from "../../../pages/ActivityLogDetailsPage";

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
  itemLog: ActivityLogInterface[];
}> = ({ itemLog }) => {
  function checkValue(value: User & Team) {
    if (value["displayName"] != undefined) {
      return <>{value.firstName}</>;
    } else if (value["name"] != undefined) {
      return <>{value.name}</>;
    } else {
      return <>{value}</>;
    }
  }

  function generateDataFromLogData(itemToGenerate: object): ReactElement[] {
    const jsxComponents = [];

    for (const [key, value] of Object.entries(itemToGenerate)) {
      if (Array.isArray(value)) {
        jsxComponents.push(
          <Box>
            {key}:{" "}
            {value.map((v) => (
              <>{checkValue(v)} </>
            ))}
          </Box>,
        );
      } else {
        if (key == "id" || key == "createdAt" || key == "updatedAt") {
          continue;
        }
        jsxComponents.push(
          <Box>
            {key} : {checkValue(value)}
          </Box>,
        );
      }
    }

    return jsxComponents;
  }

  return (
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
          <TimelineContent sx={{ py: "12px", px: 2, fontSize: 20 }}>
            {generateDataFromLogData(activity.loggedInData).map((x) => (
              <>{x}</>
            ))}
            <Typography sx={{ fontSize: 20, color: "blue" }}>
              {activity.update.length != 0
                ? "Update log: " + activity.update
                : ""}
            </Typography>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
};
