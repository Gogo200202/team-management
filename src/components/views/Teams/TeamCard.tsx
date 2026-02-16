import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { useState, type FunctionComponent } from "react";
import EditIcon from "@mui/icons-material/Edit";
import dayjs from "dayjs";
import type { Team } from "../../../api/teamTypes";
import type { User } from "../../../api/userTypes";
import TeamFormComponent from "./TeamFormComponent";

export type TeamCardProps = {
  team: Team;
  teamUsers: User[];
  allUsers: User[];

  handleDeleteClick: () => void;
  handelOpenDeleteDialog: () => void;
};

export const TeamCard: FunctionComponent<TeamCardProps> = ({
  team,
  teamUsers,
  allUsers,
  handleDeleteClick,
  handelOpenDeleteDialog,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  function deleteButton() {
    handelOpenDeleteDialog();
    handleDeleteClick?.();
  }
  return (
    <Box>
      <Card sx={{ maxWidth: 345 }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {team.name}
          </Typography>
          <Box textAlign={"center"} sx={{ color: "text.secondary" }}>
            {teamUsers.map((user, index) => (
              <Box key={index}>{user.firstName}</Box>
            ))}
            <Box>
              Created at: {dayjs(team.createdAt).format("DD, MMMM YYYY")}
            </Box>
            <Box>Updated at: {team.updatedAt}</Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button variant="outlined" onClick={() => deleteButton()}>
                delete
              </Button>

              <Button
                variant="outlined"
                onClick={() => setOpen(true)}
                startIcon={<EditIcon />}
              >
                edit teams
              </Button>
            </Box>
          </Box>
        </CardContent>

        <TeamFormComponent
          allUsers={allUsers}
          team={team}
          selectedUsers={teamUsers}
          OpenDialog={open}
          setOpenDialog={setOpen}
        />
      </Card>
  
    </Box>
  );
};

export default TeamCard;
