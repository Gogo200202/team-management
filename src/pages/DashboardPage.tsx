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

  const [projectStatus, setProjectStatus] = useState<Map<Project, StatusProm>>(
    new Map<Project, StatusProm>(),
  );

  const [projectPriority, setProjectPriority] = useState<
    Map<Project, PriorityProp>
  >(new Map<Project, PriorityProp>());

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
      const projectStatusCurrent = new Map<Project, StatusProm>();
      const projectPriorityCurrent = new Map<Project, PriorityProp>();

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

        projectStatusCurrent.set(project, {
          complete: allTaskForProject.filter((x) => x.status == "complete"),
          progress: allTaskForProject.filter((x) => x.status == "progress"),
          todo: allTaskForProject.filter((x) => x.status == "todo"),
        });
        projectPriorityCurrent.set(project, {
          high: allTaskForProject.filter((x) => x.priority == "high"),
          medium: allTaskForProject.filter((x) => x.priority == "medium"),
          low: allTaskForProject.filter((x) => x.priority == "low"),
        });
        if (allTaskForProject.length != 0) {
          projectTaskCurrent.set(project, allTaskForProject);
          allTaskForProject.map((alt) => {
            userProjectCurrent.set(project, [
              ...userProjectCurrent.get(project)!,
              allUser.find((x) => x.id == alt.assignedUserId)!,
            ]);
          });
        }
      });

      allTeams.map((team) => {
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
      setProjectStatus(projectStatusCurrent);
      setProjectPriority(projectPriorityCurrent);
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

  const dataChar = (data: any[]): any[] => {
    return Array.from(data).map(([key, value]) => {
      if (value.complete) {
        return {
          type: key.name,
          complete: value.complete.length,
          progress: value.progress.length,
          todo: value.todo.length,
        };
      } else if (value.high) {
        return {
          type: key.name,
          high: value.high.length,
          medium: value.medium.length,
          low: value.low.length,
        };
      } else if (key.firstName) {
        return {
          type: `${key.firstName} ${key.lastName}`,
          value: value.length,
        };
      } else if (key.name) {
        return {
          type: `${key.name}`,
          value: value.length,
        };
      }
    });
  };

  const seriesData = (dataSeries: any): any[] => {
    if (!dataSeries) return [];

    if (dataSeries.complete) {
      return [
        {
          data: [dataSeries?.complete.length as number],
          label: "Complete",
          color: "green",
        },
        {
          data: [dataSeries?.progress.length as number],
          label: "Progress",
        },
        { data: [dataSeries?.todo.length as number], label: "Todo" },
      ];
    } else if (dataSeries.high) {
      return [
        { data: [dataSeries?.low.length as number], label: "Low" },
        { data: [dataSeries?.medium.length as number], label: "Medium" },
        { data: [dataSeries?.high.length as number], label: "High" },
      ];
    }
  };
  return (
    <>
      Dashboard page
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex" }}>
            <BarChart
              xAxis={[{ data: ["Status"], label: "Status" }]}
              series={seriesData(status)}
              height={200}
            />
            <BarChart
              xAxis={[{ data: ["Priority"], label: "Priority" }]}
              series={seriesData(priority)}
              height={200}
            />
          </Box>
          <Box sx={{ width: "50%" }}>
            <Box>
              <Typography sx={{ textAlign: "center" }}>
                Project priority
              </Typography>
              <BarChart
                dataset={dataChar(projectPriority)}
                yAxis={[
                  {
                    disableTicks: true,
                    scaleType: "band",
                    width: 120,
                    disableLine: true,
                    dataKey: "type",
                  },
                ]}
                xAxis={[
                  {
                    disableTicks: true,
                    tickMinStep: 1,
                  },
                ]}
                series={[
                  {
                    dataKey: "low",
                    color: "green",
                    label: "Low",
                    barLabel: "value",
                  },
                  { dataKey: "medium", label: "Medium", barLabel: "value" },
                  {
                    dataKey: "high",
                    color: "red",
                    label: "High",
                    barLabel: "value",
                  },
                ]}
                layout="horizontal"
                height={250}
                colors={["blue"]}
              />
            </Box>
            <Box>
              <Typography sx={{ textAlign: "center" }}>
                Project Status
              </Typography>
              <BarChart
                dataset={dataChar(projectStatus)}
                yAxis={[
                  {
                    disableTicks: true,
                    scaleType: "band",
                    width: 120,
                    disableLine: true,
                    dataKey: "type",
                  },
                ]}
                xAxis={[
                  {
                    disableTicks: true,
                    tickMinStep: 1,
                  },
                ]}
                series={[
                  {
                    dataKey: "todo",
                    color: "red",
                    label: "Todo",
                    barLabel: "value",
                  },
                  { dataKey: "progress", label: "Progress", barLabel: "value" },
                  {
                    dataKey: "complete",
                    color: "green",
                    label: "Complete",
                    barLabel: "value",
                  },
                ]}
                layout="horizontal"
                height={250}
                colors={["blue"]}
              />
            </Box>
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
              margin={{ right: 5 }}
              width={500}
              height={400}
              hideLegend={true}
            />
          </Box>
        </Box>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ fontSize: 50 }}>Task</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ChartBar
              title="User task"
              userTaskChart={dataChar(userTask)}
              label="Task"
              color="#b2102f"
            />

            <ChartBar
              title="Project task"
              userTaskChart={dataChar(projectTask)}
              label="Task"
              color="#8bc34a"
            />
            <ChartBar
              title="Team task"
              userTaskChart={dataChar(teamTask)}
              label="Task"
            />
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ fontSize: 50 }}>User</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ChartBar
              title="Project user"
              userTaskChart={dataChar(projectUser)}
              label="User"
            />
          </AccordionDetails>
        </Accordion>
      </Box>
    </>
  );
};
