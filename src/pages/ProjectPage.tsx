import { Box, Grid } from "@mui/material";

import { useGetAllProjects } from "../api/projectController";
import ProjectCards from "../components/views/Projects/ProjectCards";

function ProjectPage() {
  const { data: allProjects = [] } = useGetAllProjects();

  return (
    <Box>
      <Box height={100}> Project page</Box>

      <Grid container spacing={25} columns={3}>
        {allProjects.map((project, index) => (
          <ProjectCards key={index} {...project} />
        ))}
      </Grid>
    </Box>
  );
}

export default ProjectPage;
