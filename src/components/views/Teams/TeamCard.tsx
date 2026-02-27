import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Collapse,
  IconButton,
  type IconButtonProps,
  styled,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { type FunctionComponent, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { Team } from "../../../api/types/teamTypes";
import type { User } from "../../../api/types/userTypes";
import TeamFormComponent from "./TeamFormComponent";

export type TeamCardProps = {
  team: Team;
  teamUsers: (User | undefined)[];
  allUsers: User[];

  handleDeleteClick?: () => void;
  handelOpenDeleteDialog?: () => void;
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
    handelOpenDeleteDialog!();
    handleDeleteClick?.();
  }
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  return (
    <Box>
      <Card sx={{ maxWidth: 345 }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {team.name}
          </Typography>
          <Box textAlign={"center"} sx={{ color: "text.secondary" }}>
            {teamUsers.map((user, index) => (
              <Box key={index}>{user!.firstName}</Box>
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
          <CardActions disableSpacing>
            <Button
              onClick={() => navigate(`/activity/details/Team/${team.id}`)}
            >
              history
            </Button>
          </CardActions>
        </CardContent>

        <TeamFormComponent
          allUsers={allUsers}
          team={team}
          selectedUsers={teamUsers}
          openDialog={open}
          setOpenDialog={setOpen}
        />
      </Card>
    </Box>
  );
};

export default TeamCard;
