/* eslint-disable react-hooks/set-state-in-effect */
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Card, Chip, Stack, Typography } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
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
import TaskDialog from "../components/views/Tasks/TaskDialog";

type UserFromTeams = {
  team: Team | undefined;
  userFromTeam: (User | undefined)[];
};

type TaskGrid = {
  id: string;
  title: string;
  priority: keyof PriorityTask;
  status: keyof StatusTask;
  userName: string | undefined;
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
  const [taskToProject, setTaskToProject] = useState<Task[] | undefined>([]);
  const [taskToProjectGrid, setTaskToProjectGrid] = useState<
    TaskGrid[] | undefined
  >([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const { mutate: deleteTask } = useDeleteTask();
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);

  const [snackDialog, setSnackDialog] = useState<boolean>(false);
  const [snackTaskToManipulate, setSnackTaskToManipulate] = useState<Task>();
  const [typeOfSnackAlert, setTypeOfSnackAlert] = useState<
    "create" | "edit" | "delete" | (string & "")
  >("");

  const [taskToManipulate, setTaskToManipulate] = useState<Task | undefined>(
    undefined,
  );
  const closeDialog = () => {
    setSnackTaskToManipulate(taskToManipulate);
    setSnackDialog(true);
    setTaskToManipulate(undefined);
    setDialogOpen(false);
  };
  const deleteDialogHandel = () => {
    setSnackTaskToManipulate(taskToManipulate);
    deleteTask(taskToManipulate!.id);
    setTaskToManipulate(undefined);
  };
  useEffect(() => {
    if (isFetched && project != undefined) {
      setProjectLoaded(project);
      const admins: (User | undefined)[] = project.adminIds.map((adminId) => {
        const finedAdmin = allUsers?.find((x) => x.id == adminId);
        if (finedAdmin != null) {
          return finedAdmin;
        }
      });

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAdmins(admins);
      const members: (User | undefined)[] = project.memberIds.map(
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
      const taskToProjectFirst: Task[] | undefined = allTask?.filter(
        (x) => x.projectId == project.id,
      );

      setTaskToProject(taskToProjectFirst);

      const taskToProjectGridFirst: TaskGrid[] | undefined =
        taskToProjectFirst?.map((x) => {
          const result: TaskGrid = {
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

  const columns: GridColDef<TaskGrid>[] = [
    { field: "id", headerName: "ID of task" },
    {
      field: "title",
      headerName: "Title",
    },
    {
      field: "status",
      headerName: "Status",
      renderCell: (params) => {
        if (params.value == "todo") {
          return <Chip label={params.value} color="primary" />;
        } else if (params.value == "inprogress") {
          return <Chip label={params.value} color="error" />;
        }
      },
    },
    {
      field: "priority",
      headerName: "Priority",
      renderCell: (params) => {
        if (params.value == "low") {
          return <Chip label={params.value} color="primary" />;
        } else if (params.value == "medium") {
          return <Chip label={params.value} color="warning" />;
        } else if (params.value == "high") {
          return <Chip label={params.value} color="error" />;
        }
      },
    },
    {
      field: "description",
      headerName: "Description",
    },
    {
      field: "userName",
      headerName: "Assigned",
    },
    {
      field: "finishUntil",
      headerName: "Finish until",
      renderCell: (params) => {
        return <>{dayjs(params.value).format("d/MM/YYYY")}</>;
      },
    },
    {
      field: "action",
      headerName: "Actions",
      width: 150,
      sortable: false,
      renderCell: (params) => {
        const onClickDelete = () => {
          const currentTask = allTask?.find((x) => x.id == params.id);
          setTaskToManipulate(currentTask);
          setTypeOfSnackAlert("delete");
          setDeleteDialog(true);
        };

        const onClickEdit = () => {
          const currentTask = allTask?.find((x) => x.id == params.id);
          setTaskToManipulate(currentTask);
          setTypeOfSnackAlert("edit");

          setDialogOpen(true);
        };

        return (
          <Box>
            <Button onClick={onClickDelete}>
              <DeleteIcon />
            </Button>

            <Button onClick={onClickEdit}>
              <EditIcon />
            </Button>
          </Box>
        );
      },
    },
  ];

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

      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={taskToProjectGrid}
          autosizeOnMount
          columns={columns}
          pageSizeOptions={[100]}
          disableRowSelectionOnClick
        />
      </Box>
      <DeleteComponent
        deleteItem={deleteDialogHandel}
        whatToDelete="task"
        openDeleteDialog={deleteDialog}
        handleCloseDelete={() => setDeleteDialog(false)}
        handleOpenSnack={() => setSnackDialog(true)}
      />
      <TaskDialog
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
