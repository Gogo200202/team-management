import { DevTool } from "@hookform/devtools";
import {
  Autocomplete,
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
import { type FunctionComponent } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { Form } from "react-router-dom";

import { useCreateProject } from "../../../api/projectController";
import type { ProjectStatus } from "../../../api/projectTypes";
import { useGetAllTeams } from "../../../api/teamController";
import type { Team } from "../../../api/teamTypes";
import { useGetAllUsers } from "../../../api/user.controller";
import type { User } from "../../../api/userTypes";

type ProjectFormsProps = {
  project: ProjectForm | null;
  openFrom: boolean;
  handleClose: () => void;
  handleCloseAgreeButton: () => void;
};

type ProjectForm = {
  name: string;
  description: string;
  status: keyof ProjectStatus;
  admins: User[];
  members: User[];
  teams: Team[];
};

const ProjectFormComponent: FunctionComponent<ProjectFormsProps> = ({
  project,
  openFrom,
  handleClose,
  handleCloseAgreeButton,
}) => {
  const { control, handleSubmit, reset } = useForm<ProjectForm>({
    defaultValues: {
      name: project?.name,
      description: project?.description,
      status: project?.status,
      admins: project?.admins,
      members: project?.members,
      teams: project?.teams,
    },
  });

  function handleCloseForm() {
    reset();
    handleClose();
  }
  const { data: users } = useGetAllUsers();
  const { data: teams } = useGetAllTeams();
  const { mutate: createProject } = useCreateProject();

  const onSubmit: SubmitHandler<ProjectForm> = (data) => {
    const idsOfAdmins: number[] = data.admins.map(function (v) {
      return parseInt(v.id);
    });
    const idsOfMembers: number[] = data.members.map(function (v) {
      return parseInt(v.id);
    });
    const idsOfTeams: number[] = data.teams.map(function (v) {
      return v.id;
    });

    createProject({
      adminIds: idsOfAdmins,
      memberIds: idsOfMembers,
      teamIds: idsOfTeams,
      description: data.description,
      name: data.name,
      status: data.status,
    });
    console.log(data);
    reset();
  };

  return (
    <>
      <Dialog open={openFrom} onClose={handleCloseForm}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Create Project</DialogTitle>
          <DialogContent>
            <Stack spacing={4}>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => (
                  <TextField
                    onChange={onChange}
                    value={value}
                    label="Name of the project"
                  />
                )}
              />
              <Controller
                control={control}
                name="admins"
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    multiple
                    onChange={(event, value) => {
                      onChange(value);
                    }}
                    options={users}
                    getOptionLabel={(option) =>
                      option.firstName + " " + option.lastName
                    }
                    renderInput={(params) => (
                      <TextField
                        value={value}
                        {...params}
                        variant="standard"
                        label="Admins"
                      />
                    )}
                  />
                )}
              />
              <Controller
                control={control}
                name="members"
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    multiple
                    onChange={(event, value) => {
                      onChange(value);
                    }}
                    options={users}
                    getOptionLabel={(option) =>
                      option.firstName + " " + option.lastName
                    }
                    renderInput={(params) => (
                      <TextField
                        value={value}
                        {...params}
                        variant="standard"
                        label="Members"
                      />
                    )}
                  />
                )}
              />
              <Controller
                control={control}
                name="teams"
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    multiple
                    onChange={(event, value) => onChange(value)}
                    options={teams}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => (
                      <TextField
                        value={value}
                        {...params}
                        variant="standard"
                        label="Teams"
                      />
                    )}
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
                      <MenuItem value={"active"}>Active</MenuItem>
                      <MenuItem value={"paused"}>Paused</MenuItem>
                      <MenuItem value={"completed"}>Completed</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, value } }) => (
                  <TextField
                    onChange={onChange}
                    value={value}
                    label="Description of the project"
                  />
                )}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseForm}>Disagree</Button>
            <Button type="submit" onClick={handleCloseAgreeButton} autoFocus>
              Agree
            </Button>
          </DialogActions>
          <DevTool control={control} /> {/* set up the dev tool */}
        </Form>
      </Dialog>
    </>
  );
};

export default ProjectFormComponent;
