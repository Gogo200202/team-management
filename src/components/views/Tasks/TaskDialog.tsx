import { DevTool } from "@hookform/devtools";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { type FunctionComponent, useEffect } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { Form } from "react-router-dom";

import { useCreateTask, useUpdateTask } from "../../../api/taskController";
import type { Project } from "../../../api/types/projectTypes";
import {
  PriorityTask,
  StatusTask,
  type Task,
} from "../../../api/types/taskType";
import type { User } from "../../../api/types/userTypes";
import { useGetAllUsers } from "../../../api/user.controller";
import { useUserContext } from "../../context/UserContext";

type TaskForm = {
  title: string;
  user: User | null;
  description: string;
  status: keyof typeof StatusTask | (string & "");
  priority: keyof typeof PriorityTask | (string & "");
  finishUntil: string;
};

type TaskDialogProp = {
  project?: Project;
  openDialog: boolean;
  closeDialog: () => void;
  task?: Task;
  openAndAddSnack: (setSnackAlert: string) => void;
};

const TaskDialog: FunctionComponent<TaskDialogProp> = ({
  project,
  closeDialog,
  openAndAddSnack,
  openDialog,
  task,
}) => {
  const { data: allUsers } = useGetAllUsers();
  const { currentUser } = useUserContext();
  const { mutate: createTask } = useCreateTask();
  const { mutate: updateTask } = useUpdateTask();

  // eslint-disable-next-line react-hooks/exhaustive-deps

  const defaultValueForm: TaskForm = {
    title: "",
    user: null,
    description: "",
    priority: "",
    status: "",
    finishUntil: dayjs().toString(),
  };

  const { handleSubmit, control, reset } = useForm<TaskForm>({
    defaultValues: defaultValueForm,
  });

  useEffect(() => {
    if (task) {
      const taskUser = allUsers?.find((x) => x.id == task.assignedUserId);
      reset({
        user: taskUser,
        description: task.description,
        title: task.title,
        finishUntil: task.finishUntil,
        status: task.status,
        priority: task.priority,
      });
    } else {
      reset(defaultValueForm);
    }
  }, [task]);

  const onSubmit: SubmitHandler<TaskForm> = async (data) => {
    if (!task) {
      createTask({
        reporterId: currentUser!.id,
        title: data.title,
        assignedUserId: data.user!.id,
        description: data.description,
        status: data.status! as keyof typeof StatusTask,
        priority: data.priority! as keyof typeof PriorityTask,
        projectId: project!.id,
        finishUntil: data.finishUntil,
      });
      openAndAddSnack("create");
    } else {
      updateTask({
        reporterId: task.reporterId!,
        title: data.title,
        assignedUserId: data.user!.id,
        description: data.description,
        status: data.status! as keyof typeof StatusTask,
        priority: data.priority! as keyof typeof PriorityTask,
        projectId: project!.id,
        finishUntil: data.finishUntil,
        createdAt: task.createdAt,
        id: task.id,
      });
      openAndAddSnack("edit");
    }

    closeDialog();

    reset(defaultValueForm);
  };
  const closeReset = () => {
    closeDialog();
    reset(defaultValueForm);
  };

  const status = Object.keys(StatusTask);
  const priorities = Object.keys(PriorityTask);

  return (
    <Box>
      <Dialog open={openDialog} keepMounted onClose={closeReset} maxWidth="xl">
        <DialogTitle>{task ? "Edit" : "Create"} task</DialogTitle>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Stack spacing={2} mt={2} width="100%">
              <Controller
                control={control}
                name="title"
                render={({ field: { onChange, value } }) => (
                  <TextField
                    value={value}
                    label="Title"
                    fullWidth
                    onChange={onChange}
                  />
                )}
              />

              <Controller
                control={control}
                name="user"
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    options={allUsers as readonly User[]}
                    getOptionLabel={(option) => option.firstName}
                    filterSelectedOptions
                    onChange={(_event, value) => onChange(value)}
                    value={value}
                    renderInput={(params) => (
                      <TextField
                        {...(params || null)}
                        label="Select user"
                        placeholder="Favorites"
                      />
                    )}
                  />
                )}
              />
              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, value } }) => (
                  <TextField
                    value={value}
                    label="Description"
                    fullWidth
                    onChange={onChange}
                  />
                )}
              />
              <Controller
                control={control}
                name="status"
                render={({ field: { onChange, value } }) => (
                  <FormControl>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={value}
                      label="Status"
                      onChange={(event) => {
                        onChange(event.target.value as string);
                      }}
                    >
                      {status.map((stat) => (
                        <MenuItem value={stat}>
                          {stat.charAt(0).toUpperCase() + stat.slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />

              <Controller
                control={control}
                name="priority"
                render={({ field: { onChange, value } }) => (
                  <RadioGroup onChange={onChange} value={value} row>
                    {priorities.map((priority) => (
                      <FormControlLabel
                        value={priority}
                        control={<Radio />}
                        label={
                          priority.charAt(0).toUpperCase() + priority.slice(1)
                        }
                      />
                    ))}
                  </RadioGroup>
                )}
              />

              <Controller
                control={control}
                name="finishUntil"
                rules={{
                  required: false,
                }}
                render={({ field: { onChange, value } }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Finish until"
                      value={dayjs(value)}
                      onChange={(newValue) => onChange(newValue)}
                    />
                  </LocalizationProvider>
                )}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeReset}>Disagree</Button>
            <Button type="submit">Agree</Button>
          </DialogActions>
          <DevTool control={control} /> {/* set up the dev tool */}
        </Form>
      </Dialog>
    </Box>
  );
};

export default TaskDialog;
