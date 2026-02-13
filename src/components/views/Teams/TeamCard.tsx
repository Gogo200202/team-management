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
import { useState, type FunctionComponent } from "react";
import EditIcon from "@mui/icons-material/Edit";
import dayjs from "dayjs";
import { useDeleteTeam } from "../../../api/teamController";
import type { Team } from "../../../api/teamTypes";
import type { User } from "../../../api/userTypes";
import TeamFormComponent from "./TeamFormComponent";
import DeleteComponent, { TypesOfDeletion } from "../../common/DeleteComponent";

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

  const [openDelete, setOpenDelete] = useState(false);

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
          <Box>Created at: {dayjs(team.createdAt).format("DD, MMMM YYYY")}</Box>
          <Box>Updated at: {team.updatedAt}</Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="outlined" onClick={() => setOpenDelete(true)}>
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

      <DeleteComponent
        open={openDelete}
        setOpen={setOpenDelete}
        typeOfToDelete={TypesOfDeletion.Team}
        id={team.id}
      />
    </Card>
  );
};

export default TeamCard;
