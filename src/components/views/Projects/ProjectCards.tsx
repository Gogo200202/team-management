import { Box, Card, CardContent, Stack, Typography } from "@mui/material";

import type { Project } from "../../../api/projectTypes";
import { useGetAllTeams } from "../../../api/teamController";
import type { Team } from "../../../api/teamTypes";
import { useGetAllUsers } from "../../../api/user.controller";
import type { User } from "../../../api/userTypes";

const ProjectCards = (project: Project) => {
  const { data: allUsers } = useGetAllUsers();
  const { data: allTeams } = useGetAllTeams();
  const admins: User[] = [];
  const members: User[] = [];
  const teams: Team[] = [];

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
    <Box sx={{ minWidth: 275 }}>
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
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProjectCards;
