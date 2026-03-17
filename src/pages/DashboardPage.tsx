import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { useEffect, useState } from "react";

import { useGetAllProjects } from "../api/projectController";
import { useGetAllTask } from "../api/taskController";
import { useGetAllTeams } from "../api/teamController";
import type { Project } from "../api/types/projectTypes";
import type { Task } from "../api/types/taskType";
import type { Team } from "../api/types/teamTypes";
import type { User } from "../api/types/userTypes";
import { useGetAllUsers } from "../api/user.controller";
import { ChartBar } from "../components/views/dashboard/ChartBar";

type StatusProm = {
  complete: Task[];
  progress: Task[];
  todo: Task[];
};
type PriorityProp = {
  high: Task[];
  medium: Task[];
  low: Task[];
};
export const DashboardPage = () => {
  const { data: allTask, isSuccess: isSuccessTasks } = useGetAllTask();
  const { data: allUser, isSuccess: isSuccessUsers } = useGetAllUsers();
  const { data: allProjects, isSuccess: isSuccessProjects } =
    useGetAllProjects();
  const { data: allTeams, isSuccess: isSuccessTeam } = useGetAllTeams();

  const [userTask, setUserTask] = useState<Map<User, Task[]>>(
    new Map<User, Task[]>(),
  );
  const [projectTask, setProjectTask] = useState<Map<Project, Task[]>>(
    new Map<Project, Task[]>(),
  );
  const [projectUser, setProjectUser] = useState<Map<Project, User[]>>(
    new Map<Project, User[]>(),
  );

  const [teamTask, setTeamTask] = useState<Map<Team, Task[]>>(
    new Map<Team, Task[]>(),
  );
  const [status, setStatus] = useState<StatusProm>();

  const [priority, setPriority] = useState<PriorityProp>();

  useEffect(() => {
    if (
      isSuccessTasks &&
      isSuccessUsers &&
      isSuccessProjects &&
      isSuccessTeam
    ) {
      const userTaskCurrent = new Map<User, Task[]>();
      const projectTaskCurrent = new Map<Project, Task[]>();
      const userProjectCurrent = new Map<Project, User[]>();
      const teamTaskCurrent = new Map<Team, Task[]>();
      allUser.map((user) => {
        const allTaskForUser = allTask.filter(
          (task) => task.assignedUserId == user.id,
        );
        if (allTaskForUser.length != 0) {
          if (!userTaskCurrent.has(user)) {
            userTaskCurrent.set(user, allTaskForUser);
          }
        }
      });
      allProjects.map((project) => {
        const allTaskForProject = allTask.filter(
          (task) => task.projectId == project.id,
        );
        const admins = project.adminIds.map(
          (ad) => allUser.find((al) => al.id == ad)!,
        );
        const members = project.memberIds.map(
          (mb) => allUser.find((al) => al.id == mb)!,
        );
        userProjectCurrent.set(project, [...admins, ...members]);

        if (allTaskForProject.length != 0) {
          projectTaskCurrent.set(project, allTaskForProject);
        }
      });

      allTeams?.map((team) => {
        team.users.map((userTeam) => {
          const result = allTask.filter((x) => x.assignedUserId == userTeam);
          teamTaskCurrent.set(team, result);
        });
      });

      const completeTask = allTask.filter((x) => x.status == "complete");
      const completeProgress = allTask.filter((x) => x.status == "progress");
      const completeTodo = allTask.filter((x) => x.status == "todo");

      const priorityHigh = allTask.filter((x) => x.priority == "high");
      const priorityMedium = allTask.filter((x) => x.priority == "medium");
      const priorityLow = allTask.filter((x) => x.priority == "low");

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPriority({
        high: priorityHigh,
        medium: priorityMedium,
        low: priorityLow,
      });
      setStatus({
        complete: completeTask,
        progress: completeProgress,
        todo: completeTodo,
      });
      setUserTask(userTaskCurrent);
      setProjectTask(projectTaskCurrent);
      setProjectUser(userProjectCurrent);
      setTeamTask(teamTaskCurrent);
    }
  }, [
    allProjects,
    allTask,
    allTeams,
    allUser,
    isSuccessProjects,
    isSuccessTasks,
    isSuccessTeam,
    isSuccessUsers,
  ]);

  const piProject = Array.from(projectTask).map(([key, value]) => {
    return {
      label: key.name,
      value: value.length,
      color: "#" + key.id.toString(),
    };
  });
  const userTaskChart = Array.from(userTask).map(([key, value]) => {
    return {
      type: `${key.firstName} ${key.lastName}`,
      value: value.length,
    };
  });

  const projectTaskChart = Array.from(projectTask).map(([key, value]) => {
    return {
      type: `${key.name}`,
      value: value.length,
    };
  });

  const projectUserChart = Array.from(projectUser).map(([key, value]) => {
    return {
      type: `${key.name}`,
      value: value.length,
    };
  });

  const teamTaskChar = Array.from(teamTask).map(([key, value]) => {
    return {
      type: `${key.name}`,
      value: value.length,
    };
  });

  const settings = {
    margin: { right: 5 },
    width: 500,
    height: 400,
    hideLegend: true,
  };
  return (
    <>
      Dashboard page
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex" }}>
            {" "}
            <BarChart
              xAxis={[{ data: ["Status"], label: "Status" }]}
              series={[
                { data: [status?.complete.length], label: "Complete" },
                { data: [status?.progress.length], label: "Progress" },
                { data: [status?.todo.length], label: "Todo" },
              ]}
              height={200}
            />
            <BarChart
              xAxis={[{ data: ["Priority"], label: "Priority" }]}
              series={[
                { data: [priority?.high.length], label: "High" },
                { data: [priority?.medium.length], label: "Medium" },
                { data: [priority?.low.length], label: "Low" },
              ]}
              height={200}
            />
          </Box>
          <Box sx={{ height: 1 }}>
            <Typography sx={{ textAlign: "center", fontSize: 30 }}>
              Project task
            </Typography>
            <PieChart
              series={[
                {
                  innerRadius: 50,
                  outerRadius: 200,
                  data: piProject,
                  arcLabel: (item) => `${item.label} : ${item.value} `,
                },
              ]}
              {...settings}
            />
          </Box>
        </Box>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Task</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ChartBar
              title="User task"
              userTaskChart={userTaskChart}
              label="Task"
            />

            <ChartBar
              title="Project task"
              userTaskChart={projectTaskChart}
              label="Task"
            />
            <ChartBar
              title="Team task"
              userTaskChart={teamTaskChar}
              label="Task"
            />
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>User</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ChartBar
              title="Project user"
              userTaskChart={projectUserChart}
              label="User"
            />
          </AccordionDetails>
        </Accordion>
      </Box>
    </>
  );
};
