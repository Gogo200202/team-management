import { Box, Button, Grid } from "@mui/material";
import { useState } from "react";

import {
  projectKeys,
  useDeleteProject,
  useGetAllProjects,
} from "../api/projectController";
import type { Project } from "../api/types/projectTypes";
import DeleteComponent from "../components/common/DeleteComponent";
import ProjectCards from "../components/views/Projects/ProjectCards";
import ProjectForm from "../components/views/Projects/ProjectFormComponent";

function ProjectPage() {
  const { data: allProjects = [] } = useGetAllProjects();
  const { mutate: deleteProject } = useDeleteProject();
  const [openFrom, setOpenFrom] = useState(false);
  const [projectToManipulate, setProjectToManipulate] = useState<
    Project | undefined
  >(undefined);
  const [projectToManipulateUndo, setProjectToManipulateUndo] = useState<
    Project | undefined
  >(undefined);

  const [openSnack, setOpenSnack] = useState<boolean>(false);
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);

  const handleOpenCreateForm = () => {
    setOpenFrom(true);
  };
  const handleOpenForm = () => {
    setOpenFrom(true);
  };

  const handleCloseForm = () => {
    setProjectToManipulate(undefined);
    setOpenFrom(false);
  };

  const handleCloseAgreeButton = () => {
    setOpenFrom(false);
  };

  return (
    <>
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "2/3",
          }}
        >
          Project page
          <Button variant="contained" onClick={handleOpenCreateForm}>
            Create project
          </Button>
        </Box>

        <Grid container spacing={25} columns={3}>
          {allProjects.map((project, index) => (
            <ProjectCards
              handelOpenDeleteDialog={() => setDeleteDialog(true)}
              handleDeleteClick={() => setProjectToManipulate(project)}
              key={index}
              project={project}
              setProjectToManipulate={setProjectToManipulate}
              openEdit={handleOpenForm}
            />
          ))}
        </Grid>
      </Box>

      <ProjectForm
        resetProjectState={() => setProjectToManipulate(undefined)}
        project={projectToManipulate}
        openFrom={openFrom}
        handleCloseForm={handleCloseForm}
        handleCloseAgreeButton={handleCloseAgreeButton}
      />
      {projectToManipulate && (
        <DeleteComponent<Project>
          deleteItem={() => deleteProject(projectToManipulate.id)}
          deleteItemFromSet={() => setProjectToManipulate(undefined)}
          setItemToUndoDelete={setProjectToManipulateUndo}
          openDeleteDialog={deleteDialog}
          handleCloseDelete={() => setDeleteDialog(false)}
          handleOpenSnack={() => setOpenSnack(true)}
          typeOfToDelete={projectKeys.allProjects}
          item={projectToManipulate}
        />
      )}
    </>
  );
}

export default ProjectPage;
