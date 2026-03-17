import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { useEffect, useState } from "react";

import { useGetAllProjects } from "../api/projectController";
import { useGetAllTask } from "../api/taskController";
import type { Project } from "../api/types/projectTypes";
import type { Task } from "../api/types/taskType";
import type { User } from "../api/types/userTypes";
import { useGetAllUsers } from "../api/user.controller";

export const DashboardPage = () => {
  const { data: allTask, isSuccess: isSuccessTasks } = useGetAllTask();
  const { data: allUser, isSuccess: isSuccessUsers } = useGetAllUsers();
  const { data: allProjects, isSuccess: isSuccessProjects } =
    useGetAllProjects();

  const [userTask, setUserTask] = useState<Map<User, Task[]>>(
    new Map<User, Task[]>(),
  );
  const [projectTask, setProjectTask] = useState<Map<Project, Task[]>>(
    new Map<Project, Task[]>(),
  );
  const [projectUser, setProjectUser] = useState<Map<Project, User[]>>(
    new Map<Project, User[]>(),
  );

  useEffect(() => {
    if (isSuccessTasks && isSuccessUsers && isSuccessProjects) {
      const userTaskCurrent = new Map<User, Task[]>();
      const projectTaskCurrent = new Map<Project, Task[]>();
      const userProjectCurrent = new Map<Project, User[]>();

      console.log(allUser);
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

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUserTask(userTaskCurrent);
      setProjectTask(projectTaskCurrent);
      setProjectUser(userProjectCurrent);
    }
  }, [
    allProjects,
    allTask,
    allUser,
    isSuccessProjects,
    isSuccessTasks,
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
      user: `${key.firstName} ${key.lastName}`,
      tasks: value.length,
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
      <Box sx={{ display: "flex", height: 1 }}>
        <Box sx={{ display: "flex", width: "75%" }}>
          <Card sx={{ height: "40%", width: "20%", m: 2 }} variant="outlined">
            <CardContent>
              <Typography
                gutterBottom
                sx={{ color: "text.secondary", fontSize: 14 }}
              >
                Users
              </Typography>
              <Typography variant="h5" component="div">
                Users
              </Typography>
              <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
                adjective
              </Typography>
              <Typography variant="body2">
                well meaning and kindly.
                <br />
                {'"a benevolent smile"'}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => console.log("Learn More")}>
                Learn More
              </Button>
            </CardActions>
          </Card>

          <Card sx={{ height: "40%", width: "20%", m: 2 }} variant="outlined">
            <CardContent>
              <Typography
                gutterBottom
                sx={{ color: "text.secondary", fontSize: 14 }}
              >
                Teams
              </Typography>
              <Typography variant="h5" component="div">
                Teams
              </Typography>
              <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
                adjective
              </Typography>
              <Typography variant="body2">
                well meaning and kindly.
                <br />
                {'"a benevolent smile"'}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => console.log("Learn More")}>
                Learn More
              </Button>
            </CardActions>
          </Card>

          <Card sx={{ height: "40%", width: "20%", m: 2 }} variant="outlined">
            <CardContent>
              <Typography
                gutterBottom
                sx={{ color: "text.secondary", fontSize: 14 }}
              >
                Projects
              </Typography>
              <Typography variant="h5" component="div">
                Projects
              </Typography>
              <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
                adjective
              </Typography>
              <Typography variant="body2">
                well meaning and kindly.
                <br />
                {'"a benevolent smile"'}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => console.log("Learn More")}>
                Learn More
              </Button>
            </CardActions>
          </Card>
        </Box>
        <Box sx={{ height: 200 }}>
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
      <Box>
        <Typography sx={{ textAlign: "center", fontSize: 30 }}>
          Task per user
        </Typography>
        <BarChart
          dataset={userTaskChart}
          yAxis={[
            {
              disableTicks: true,
              scaleType: "band",
              width: 120,
              disableLine: true,
              dataKey: "user",
            },
          ]}
          xAxis={[
            {
              disableTicks: true,
              tickMinStep: 1,
            },
          ]}
          series={[{ dataKey: "tasks", label: "Tasks" }]}
          layout="horizontal"
          height={250}
        />
      </Box>
    </>
  );
};
