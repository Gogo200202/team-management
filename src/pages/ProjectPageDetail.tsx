import { Box, Card, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { useGetProject } from "../api/projectController";
import { useGetAllTeams } from "../api/teamController";
import type { Team } from "../api/types/teamTypes";
import type { User } from "../api/types/userTypes";
import { useGetAllUsers } from "../api/user.controller";

type UserFromTeams = {
  team: Team;
  userFromTeam: (User | undefined)[];
};

function ProjectPageDetail() {
  const { data: allUsers } = useGetAllUsers();
  const { data: allTeams } = useGetAllTeams();

  const { projectsId } = useParams();

  const { data: project, isFetched } = useGetProject(projectsId!);

  const [admins, setAdmins] = useState<User[]>([]);

  const [members, setMembers] = useState<User[]>([]);

  const [teams, setTeams] = useState<Team[]>([]);
  const [usersFromTeams, SetUsersFromTeams] = useState<UserFromTeams[]>([]);
  useEffect(() => {
    if (isFetched && project != undefined) {
      const admins: User[] = project.adminIds.map((adminId) => {
        const finedAdmin = allUsers?.find((x) => x.id == adminId);
        if (finedAdmin != null) {
          return finedAdmin;
        }
      });

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAdmins(admins);
      const members: User[] = project.memberIds.map((memberId) => {
        const finedMember = allUsers?.find((x) => x.id == memberId);
        if (finedMember != null) {
          return finedMember;
        }
      });
      setMembers(members);
      const teams: Team[] = project!.teamIds.map((teamId) => {
        const finedTeams = allTeams?.find((x) => x.id == teamId);

        if (finedTeams != undefined) {
          return finedTeams;
        }
      });

      setTeams(teams);
      // alice bob
      const userTeams: UserFromTeams[] = teams!.map((team) => {
        const userFromTeam = team.users.map((userId) => {
          const finedUser = allUsers?.find((x) => parseInt(x.id) == userId);
          if (finedUser != null) {
            return finedUser;
          }
        });
        const result: UserFromTeams = {
          team: team,
          userFromTeam: userFromTeam!,
        };

        return result;
      });

      SetUsersFromTeams(userTeams);
    }
  }, [allTeams, allUsers, isFetched, project]);

  return (
    <Box>
      <Card variant="outlined">
        <Box sx={{ fontSize: "50px" }}>Page Detail for {project?.name}</Box>
        <Box>
          <Stack>
            <Box
              sx={{
                display: "inline-flex",
                color: "text.secondary",
                mb: 1.5,
              }}
            >
              Admins:
              {admins.map((admin, index) => (
                <Box sx={{ marginLeft: 1 }} key={index}>
                  {admin.firstName} {admin.lastName}
                </Box>
              ))}
            </Box>
            <Box
              sx={{
                display: "inline-flex",
                color: "text.secondary",
                mb: 1.5,
              }}
            >
              Members:
              {members.map((member, index) => (
                <Box sx={{ marginLeft: 1 }} key={index}>
                  {member.firstName} {member.lastName}
                </Box>
              ))}
            </Box>

            <Box
              sx={{
                display: "inline-flex",
                color: "text.secondary",
                mb: 1.5,
              }}
            >
              Teams:
              {usersFromTeams.map((x, index) => (
                <Box sx={{ marginLeft: 1 }} key={index}>
                  {x.team.name}
                  <Stack>
                    {x.userFromTeam.map((user) => (
                      <Box>{user?.firstName}</Box>
                    ))}
                  </Stack>
                </Box>
              ))}
            </Box>
          </Stack>
          <Typography variant="body2">
            Description: {project?.description}
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}

export default ProjectPageDetail;
