import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import type { FunctionComponent } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { Form } from "react-router-dom";

import { useCreateTask } from "../../../api/taskController";
import type { Project } from "../../../api/types/projectTypes";
import type { PriorityTask, StatusTask } from "../../../api/types/taskType";
import type { User } from "../../../api/types/userTypes";
import { useGetAllUsers } from "../../../api/user.controller";
type TaskForm = {
  title: string;
  user: User | undefined;
  description: string;
  status: keyof StatusTask | undefined;
  priority: keyof PriorityTask | undefined;
  finishUntil: string;
};
const defaultValueForm: TaskForm = {
  title: "",
  user: undefined,
  description: "",
  status: undefined,
  priority: undefined,
  finishUntil: "",
};

type TaskDialogProp = {
  project: Project | undefined;
  openDialog: boolean;
  closeDialog: () => void;
};
const TaskDialog: FunctionComponent<TaskDialogProp> = ({
  project,
  closeDialog,
  openDialog,
}) => {
  const { data: allUsers } = useGetAllUsers();
  const { mutate: createTask } = useCreateTask();
  const { handleSubmit, control, reset } = useForm<TaskForm>({
    defaultValues: defaultValueForm,
  });

  const onSubmit: SubmitHandler<TaskForm> = async (data) => {
    createTask({
      title: data.title,
      assignedUserId: data.user!.id,
      description: data.description,
      status: data.status!,
      priority: data.priority!,
      projectId: project!.id,
      finishUntil: data.finishUntil,
    });
    closeDialog();
    reset(defaultValueForm);
  };

  return (
    <Box>
      <Dialog open={openDialog} keepMounted onClose={closeDialog} maxWidth="xl">
        <DialogTitle>Create task</DialogTitle>
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
                    options={allUsers}
                    getOptionLabel={(option) => option.firstName}
                    filterSelectedOptions
                    onChange={(_event, value) => onChange(value)}
                    value={value}
                    renderInput={(params) => (
                      <TextField
                        {...(params || null)}
                        label="Select users"
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
                      <MenuItem value={"todo"}>Todo</MenuItem>
                      <MenuItem value={"inprogress"}>In-progress</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="priority"
                render={({ field: { onChange, value } }) => (
                  <FormControl>
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={value}
                      label="Priority"
                      onChange={(event) => {
                        onChange(event.target.value as string);
                      }}
                    >
                      <MenuItem value={"low"}>Low</MenuItem>
                      <MenuItem value={"medium"}>Medium</MenuItem>
                      <MenuItem value={"high"}>High</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />

              <Controller
                control={control}
                name="finishUntil"
                render={({ field: { onChange, value } }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker"]}>
                      <DatePicker
                        label="Finish until"
                        value={dayjs(value)}
                        onChange={(newValue) => onChange(newValue)}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                )}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog}>Disagree</Button>
            <Button type="submit">Agree</Button>
          </DialogActions>
        </Form>
      </Dialog>
    </Box>
  );
};

export default TaskDialog;
