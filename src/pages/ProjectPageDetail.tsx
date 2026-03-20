import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Card, Chip, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { useGetProject } from "../api/projectController";
import { taskKeys, useDeleteTask, useGetAllTask } from "../api/taskController";
import { useGetAllTeams } from "../api/teamController";
import type { Project } from "../api/types/projectTypes";
import type { PriorityTask, StatusTask, Task } from "../api/types/taskType";
import type { Team } from "../api/types/teamTypes";
import type { User } from "../api/types/userTypes";
import { useGetAllUsers } from "../api/user.controller";
import DeleteComponent from "../components/common/DeleteComponent";
import { SnackbarComponent } from "../components/common/SnackbarComponent";
import {
  type ColumnProps,
  TableComponents,
} from "../components/views/Tables/TableComponents";
import TaskDialog from "../components/views/Tasks/TaskDialog";

type UserFromTeams = {
  team?: Team;
  userFromTeam: (User | undefined)[];
};

type TaskGrid = {
  id: string;
  reporter?: User;
  reporterName?: string;
  title: string;
  priority: keyof typeof PriorityTask;
  status: keyof typeof StatusTask;
  userName?: string;
  description: string;
  finishUntil: string;
};

type TaskTable = {
  id: string;
  reporterName: string;
  userName: string;
  title: string;
  status: string;
  priority: string;
  description: string;
  finishUntil: string;
};

function ProjectPageDetail() {
  const { data: allUsers } = useGetAllUsers();
  const { data: allTeams } = useGetAllTeams();
  const { data: allTask } = useGetAllTask();
  const { projectsId } = useParams();
  const { data: project, isFetched } = useGetProject(projectsId!);

  const [projectLoaded, setProjectLoaded] = useState<Project>();
  const [admins, setAdmins] = useState<(User | undefined)[]>([]);
  const [members, setMembers] = useState<(User | undefined)[]>([]);
  const [usersFromTeams, setUsersFromTeams] = useState<UserFromTeams[]>([]);

  const [taskToProjectGrid, setTaskToProjectGrid] = useState<
    TaskGrid[] | undefined
  >([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const { mutate: deleteTask } = useDeleteTask();
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);

  const [snackDialog, setSnackDialog] = useState<boolean>(false);
  const [snackTaskToManipulate, setSnackTaskToManipulate] = useState<Task>();
  const [typeOfSnackAlert, setTypeOfSnackAlert] = useState<string>("");

  const [taskToManipulate, setTaskToManipulate] = useState<Task | undefined>(
    undefined,
  );
  const snackManipulation = (typeToManipulate: string) => {
    setSnackTaskToManipulate(taskToManipulate);
    setTypeOfSnackAlert(typeToManipulate);
    setSnackDialog(true);
  };

  const closeDialog = () => {
    setSnackTaskToManipulate(taskToManipulate);

    setTaskToManipulate(undefined);
    setDialogOpen(false);
  };
  const deleteDialogHandel = () => {
    setSnackTaskToManipulate(taskToManipulate);
    deleteTask(taskToManipulate!.id);
    setTaskToManipulate(undefined);
  };
  useEffect(() => {
    if (isFetched) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProjectLoaded(project);
      const admins: (User | undefined)[] = project!.adminIds.map((adminId) => {
        const finedAdmin = allUsers?.find((x) => x.id == adminId);
        if (finedAdmin != null) {
          return finedAdmin;
        }
      });

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAdmins(admins);
      const members: (User | undefined)[] = project!.memberIds.map(
        (memberId) => {
          const finedMember = allUsers?.find(
            (x) => x.id == memberId.toString(),
          );
          if (finedMember != null) {
            return finedMember;
          }
        },
      );
      setMembers(members);
      const teams: (Team | undefined)[] = project!.teamIds.map((teamId) => {
        const finedTeams = allTeams?.find((x) => x.id == teamId.toString());

        if (finedTeams != undefined) {
          return finedTeams;
        }
      });

      const userTeams: UserFromTeams[] = teams!.map((team) => {
        const userFromTeam = team!.users.map((userId) => {
          const finedUser = allUsers?.find((x) => x.id == userId);
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
      const taskToProjectFirst: Task[] | undefined = allTask?.filter(
        (x) => x.projectId == project!.id,
      );

      const taskToProjectGridFirst: TaskGrid[] | undefined =
        taskToProjectFirst?.map((x) => {
          const result: TaskGrid = {
            reporter: allUsers?.find((u) => u.id == x.reporterId),
            reporterName: allUsers?.find((u) => u.id == x.reporterId)
              ?.firstName,
            description: x.description,
            id: x.id,
            priority: x.priority,
            title: x.title,
            status: x.status,
            userName: allUsers?.find((u) => u.id == x.assignedUserId)
              ?.firstName,
            finishUntil: x.finishUntil,
          };

          return result;
        });

      setTaskToProjectGrid(taskToProjectGridFirst);
    }
  }, [allTask, allTeams, allUsers, isFetched, project]);

  const cornetColum: ColumnProps<TaskTable>[] = [
    {
      key: "id",
      label: "Id of task",
    },
    {
      key: "reporterName",
      label: "Reporter",
    },
    {
      key: "userName",
      label: "User",
    },
    {
      key: "title",
      label: "Title",
    },
    {
      key: "status",
      label: "Status",
      renderRowCell(row) {
        if (row.status == "todo") {
          return <Chip label={row.status} color="primary" />;
        } else if (row.status == "progress") {
          return <Chip label={row.status} color="error" />;
        } else if (row.status == "complete") {
          return <Chip label={row.status} color="success" />;
        }
        return <></>;
      },
    },
    {
      key: "priority",
      label: "Priority",
      renderRowCell(row) {
        if (row.priority == "low") {
          return <Chip label={row.priority} color="primary" />;
        } else if (row.priority == "medium") {
          return <Chip label={row.priority} color="warning" />;
        } else if (row.priority == "high") {
          return <Chip label={row.priority} color="error" />;
        }
        return <></>;
      },
    },
    {
      key: "description",
      label: "Description",
    },
    {
      key: "finishUntil",
      label: "Finish until",
    },
    {
      key: "action",
      label: "Action",
      renderRowCell: (row) => (
        <Box sx={{ display: "flex" }}>
          <Box>
            <Button onClick={() => onClickDelete(row.id)}>
              <DeleteIcon />
            </Button>
          </Box>
          <Box>
            <Button onClick={() => onClickEdit(row.id)}>
              <EditIcon />
            </Button>
          </Box>
        </Box>
      ),
    },
  ];

  const onClickEdit = (id: string) => {
    const currentTask = allTask?.find((x) => x.id == id);
    setTaskToManipulate(currentTask);
    setTypeOfSnackAlert("edit");

    setDialogOpen(true);
  };
  const onClickDelete = (id: string) => {
    const currentTask = allTask?.find((x) => x.id == id);
    setTaskToManipulate(currentTask);
    setTypeOfSnackAlert("delete");
    setDeleteDialog(true);
  };

  const test: TaskTable[] = taskToProjectGrid!.map((x) => {
    return {
      id: x.id,
      reporterName: x.reporterName || "",
      userName: x.userName || "",
      title: x.title,
      status: x.status || "",
      priority: x.priority || "",
      description: x.description,
      finishUntil: dayjs(x.finishUntil).format("MM/DD/YYYY"),
    };
  });

  return (
    <Box sx={{ width: "100%" }}>
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
                    {admin!.firstName} {admin!.lastName}
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
                    {member!.firstName} {member!.lastName}
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
                    {x.team!.name}
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
          <Button onClick={() => setDialogOpen(true)}> Create task</Button>
        </Box>
      </Box>

      <Box>
        <TableComponents columns={cornetColum} rows={test} />
      </Box>
      <DeleteComponent
        deleteItem={deleteDialogHandel}
        whatToDelete="task"
        openDeleteDialog={deleteDialog}
        handleCloseDelete={() => setDeleteDialog(false)}
        handleOpenSnack={() => setSnackDialog(true)}
      />
      <TaskDialog
        openAndAddSnack={snackManipulation}
        task={taskToManipulate}
        project={projectLoaded}
        openDialog={dialogOpen}
        closeDialog={closeDialog}
      />
      <SnackbarComponent
        open={snackDialog}
        handelClose={() => setSnackDialog(false)}
        keysForQuery={taskKeys.allTasks}
        lastItem={snackTaskToManipulate}
        typeOfAlert={typeOfSnackAlert}
      />
    </Box>
  );
}

export default ProjectPageDetail;
