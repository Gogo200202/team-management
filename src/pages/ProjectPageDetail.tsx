import { Box, Button, Card, Grid, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { useGetProject } from "../api/projectController";
import { useGetAllTask } from "../api/taskController";
import { useGetAllTeams } from "../api/teamController";
import type { Task } from "../api/types/taskType";
import type { Team } from "../api/types/teamTypes";
import type { User } from "../api/types/userTypes";
import { useGetAllUsers } from "../api/user.controller";
import TaskCars from "../components/views/Tasks/TaskCars";

type UserFromTeams = {
  team: Team;
  userFromTeam: (User | undefined)[];
};

function ProjectPageDetail() {
  const { data: allUsers } = useGetAllUsers();
  const { data: allTeams } = useGetAllTeams();
  const { data: allTask } = useGetAllTask();
  const { projectsId } = useParams();

  const { data: project, isFetched } = useGetProject(projectsId!);

  const [admins, setAdmins] = useState<User[]>([]);

  const [members, setMembers] = useState<User[]>([]);

  const [usersFromTeams, setUsersFromTeams] = useState<UserFromTeams[]>([]);

  const [taskToProject, setTaskToProject] = useState<Task[]>([]);

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

      setUsersFromTeams(userTeams);
      const taskToProjectFirst: Task[] = allTask?.map((task) => {
        if (task.projectId == project.id) {
          return task;
        }
      });

      setTaskToProject(taskToProjectFirst);
    }
  }, [allTask, allTeams, allUsers, isFetched, project]);

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
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
        <Box height={"0"}>
          <Button> Create task</Button>
        </Box>
      </Box>
      <Grid container spacing={40} columns={3}>
        {taskToProject.map((task) => (
          <TaskCars task={task} />
        ))}
      </Grid>
    </Box>
  );
}

export default ProjectPageDetail;
