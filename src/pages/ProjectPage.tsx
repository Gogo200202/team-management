import { Box, Button, Grid } from "@mui/material";
import { useState } from "react";

import { useGetAllProjects } from "../api/projectController";
import ProjectCards from "../components/views/Projects/ProjectCards";
import ProjectForm from "../components/views/Projects/ProjectFormComponent";

function ProjectPage() {
  const { data: allProjects = [] } = useGetAllProjects();
  const [openFrom, setOpenFrom] = useState(false);
  const handleClose = () => {
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
          <Button variant="contained" onClick={() => setOpenFrom(true)}>
            Create project
          </Button>
        </Box>

        <Grid container spacing={25} columns={3}>
          {allProjects.map((project, index) => (
            <ProjectCards key={index} {...project} />
          ))}
        </Grid>
      </Box>
      <ProjectForm
        project={null}
        openFrom={openFrom}
        handleClose={handleClose}
        handleCloseAgreeButton={handleCloseAgreeButton}
      />
    </>
  );
}

export default ProjectPage;
