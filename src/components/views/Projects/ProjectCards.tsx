import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import {
  type Dispatch,
  type FunctionComponent,
  type SetStateAction,
} from "react";

import { useGetAllTeams } from "../../../api/teamController";
import type { Project } from "../../../api/types/projectTypes";
import type { Team } from "../../../api/types/teamTypes";
import type { User } from "../../../api/types/userTypes";
import { useGetAllUsers } from "../../../api/user.controller";

type ProjectCardsProps = {
  project: Project;
  setProjectToManipulate: Dispatch<SetStateAction<Project | undefined>>;
  openEdit: () => void;
  handelOpenDeleteDialog: () => void;
  handleDeleteClick: () => void;
};

const ProjectCards: FunctionComponent<ProjectCardsProps> = ({
  project,
  setProjectToManipulate,
  openEdit,
  handelOpenDeleteDialog,
  handleDeleteClick,
}) => {
  const { data: allUsers } = useGetAllUsers();
  const { data: allTeams } = useGetAllTeams();
  const admins: User[] = [];
  const members: User[] = [];
  const teams: Team[] = [];

  function deleteButton() {
    handelOpenDeleteDialog();
    handleDeleteClick?.();
  }

  const handleEditButton = () => {
    setProjectToManipulate(project);
    openEdit();
  };

  for (let i = 0; i < project.adminIds.length; i++) {
    const finedAdmin = allUsers?.find(
      (x) => x.id == project.adminIds[i].toString(),
    );
    if (finedAdmin != null) {
      admins.push(finedAdmin);
    }
  }

  for (let i = 0; i < project.memberIds.length; i++) {
    const finedMember = allUsers?.find(
      (x) => x.id == project.memberIds[i].toString(),
    );
    if (finedMember != null) {
      members.push(finedMember);
    }
  }
  for (let i = 0; i < project.teamIds.length; i++) {
    const finedTeams = allTeams?.find((x) => x.id == project.teamIds[i]);
    if (finedTeams != null) {
      teams.push(finedTeams);
    }
  }
  return (
    <Box sx={{ maxWidth: 275 }}>
      <Card variant="outlined">
        <CardContent>
          <Typography
            gutterBottom
            sx={{ color: "text.secondary", fontSize: 14 }}
          >
            {project.status}
          </Typography>
          <Typography variant="h5" component="div">
            {project.name}
          </Typography>
          <Stack>
            <Box
              sx={{ display: "inline-flex", color: "text.secondary", mb: 1.5 }}
            >
              Admins:
              {admins.map((admin, index) => (
                <Box sx={{ marginLeft: 1 }} key={index}>
                  {admin.firstName} {admin.lastName}
                </Box>
              ))}
            </Box>
            <Box
              sx={{ display: "inline-flex", color: "text.secondary", mb: 1.5 }}
            >
              Members:
              {members.map((member, index) => (
                <Box sx={{ marginLeft: 1 }} key={index}>
                  {member.firstName} {member.lastName}
                </Box>
              ))}
            </Box>

            <Box
              sx={{ display: "inline-flex", color: "text.secondary", mb: 1.5 }}
            >
              Teams:
              {teams.map((team, index) => (
                <Box sx={{ marginLeft: 1 }} key={index}>
                  {team.name}
                </Box>
              ))}
            </Box>
          </Stack>
          <Typography variant="body2">{project.description}</Typography>
          <Box sx={{ display: "flex" }}>
            <Button onClick={() => deleteButton()}>delete</Button>
            <Button onClick={handleEditButton}>edit</Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProjectCards;
