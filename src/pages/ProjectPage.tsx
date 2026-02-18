import { Box, Button, Grid } from "@mui/material";
import { useState } from "react";

import { useGetAllProjects } from "../api/projectController";
import type { Project } from "../api/projectTypes";
import ProjectCards from "../components/views/Projects/ProjectCards";
import ProjectForm from "../components/views/Projects/ProjectFormComponent";

function ProjectPage() {
  const { data: allProjects = [] } = useGetAllProjects();
  const [openFrom, setOpenFrom] = useState(false);
  const [projectToManipulate, setProjectToManipulate] = useState<
    Project | undefined
  >(undefined);

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
    </>
  );
}

export default ProjectPage;
