import { Box, Card, CardContent, Typography } from "@mui/material";
import type { Team } from "../../api/teamTypes";
import type { FunctionComponent } from "react";

export class TeamCardProps {
  team: Team;
  userNames: string[];
  constructor(t: Team, u: string[]) {
    this.team = t;
    this.userNames = u;
  }
}

export const TeamCard: FunctionComponent<TeamCardProps> = ({
  team,
  userNames,
}) => {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {team.name}
        </Typography>
        <Typography
          variant="body2"
          textAlign={"center"}
          sx={{ color: "text.secondary" }}
        >
          {userNames.map((userName, index) => (
            <Box key={index}>{userName}</Box>
          ))}
          createdAt:{team.createdAt}
          updatedAt: {team.updatedAt}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TeamCard;
