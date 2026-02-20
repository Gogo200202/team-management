import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import {
  type Dispatch,
  type FunctionComponent,
  type SetStateAction,
} from "react";
import { useNavigate } from "react-router-dom";

import type { Project } from "../../../api/types/projectTypes";

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
  const navigate = useNavigate();

  function deleteButton() {
    handelOpenDeleteDialog();
    handleDeleteClick?.();
  }

  const handleEditButton = () => {
    setProjectToManipulate(project);
    openEdit();
  };

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

          <Box sx={{ display: "flex" }}>
            <Button onClick={() => deleteButton()}>delete</Button>
            <Button onClick={handleEditButton}>edit</Button>
          </Box>
          <Box>
            <Button onClick={() => navigate(`details/${project.id}`)}>
              open details
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProjectCards;
