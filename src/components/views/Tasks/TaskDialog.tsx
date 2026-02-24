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
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { type FunctionComponent, useEffect } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { Form } from "react-router-dom";

import { useCreateTask, useUpdateTask } from "../../../api/taskController";
import type { Project } from "../../../api/types/projectTypes";
import type {
  PriorityTask,
  StatusTask,
  Task,
} from "../../../api/types/taskType";
import type { User } from "../../../api/types/userTypes";
import { useGetAllUsers } from "../../../api/user.controller";
import { useUserContext } from "../../context/UserContext";
type TaskForm = {
  title: string;
  user: User | null;
  description: string;
  status: keyof StatusTask | (string & "");
  priority: keyof PriorityTask | (string & "");
  finishUntil: string;
};

type TaskDialogProp = {
  project: Project | undefined;
  openDialog: boolean;
  closeDialog: () => void;
  task: Task | undefined;
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
        status: data.status! as keyof StatusTask,
        priority: data.priority! as keyof PriorityTask,
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
        status: data.status! as keyof StatusTask,
        priority: data.priority! as keyof PriorityTask,
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
                      <MenuItem value="todo">Todo</MenuItem>
                      <MenuItem value="inprogress">In-progress</MenuItem>
                      <MenuItem value="complete">Complete</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />

              <Controller
                control={control}
                name="priority"
                render={({ field: { onChange, value } }) => (
                  <RadioGroup onChange={onChange} value={value} row>
                    <FormControlLabel
                      value="low"
                      control={<Radio />}
                      label="Low"
                    />
                    <FormControlLabel
                      value="medium"
                      control={<Radio />}
                      label="Medium"
                    />
                    <FormControlLabel
                      value="high"
                      control={<Radio />}
                      label="High"
                    />
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
                      disablePast
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
