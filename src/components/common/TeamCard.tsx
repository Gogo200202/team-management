import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogTitle,
  Typography,
} from "@mui/material";
import type { Team } from "../../api/teamTypes";
import { useState, type FunctionComponent } from "react";
import EditIcon from "@mui/icons-material/Edit";
import { useDeleteTeam } from "../../api/teamController";
import type { User } from "../../api/userTypes";
import TeamFormComponent from "./TeamFormComponent";
import dayjs from "dayjs";

export type TeamCardProps = {
  team: Team;
  teamUsers: User[];
  allUsers: User[];
};

export const TeamCard: FunctionComponent<TeamCardProps> = ({
  team,
  teamUsers,
  allUsers,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { mutate: deleteTeam } = useDeleteTeam();

  const [openDelete, setOpenDelete] = useState(false);

  const handleClickOpenDelete = () => {
    setOpenDelete(true);
  };

  const handleClose = async () => {
    deleteTeam(team.id);

    setOpenDelete(false);
  };

  const handleDelete = async () => {
    deleteTeam(team.id);

    handleClose();
  };

  return (
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
            <Button variant="outlined" onClick={handleClickOpenDelete}>
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

      <Dialog
        open={openDelete}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Do you want to delete this team"}
        </DialogTitle>

        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleDelete} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default TeamCard;
