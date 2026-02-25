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
import { type FunctionComponent, useEffect } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { Form } from "react-router-dom";

import {
  useCreateProject,
  useUpdateProject,
} from "../../../api/projectController";
import { useGetAllTeams } from "../../../api/teamController";
import type { Project, ProjectStatus } from "../../../api/types/projectTypes";
import type { Team } from "../../../api/types/teamTypes";
import type { User } from "../../../api/types/userTypes";
import { useGetAllUsers } from "../../../api/user.controller";

type ProjectFormsProps = {
  project?: Project;
  openFrom: boolean;
  handleCloseForm: () => void;
  handleCloseAgreeButton: () => void;
  resetProjectState: () => void;
};

type ProjectForm = {
  name: string;
  description: string;
  status: keyof ProjectStatus;
  admins: User[];
  members: User[];
  teams: Team[];
};
const defaultValuesForm: ProjectForm = {
  admins: [],
  description: "",
  members: [],
  name: "",
  status: "paused",
  teams: [],
};
const ProjectFormComponent: FunctionComponent<ProjectFormsProps> = ({
  project,
  openFrom,
  handleCloseForm,
  handleCloseAgreeButton,
}) => {
  const { control, handleSubmit, reset } = useForm<ProjectForm>();

  const { data: allUsers } = useGetAllUsers();
  const { data: allTeams } = useGetAllTeams();

  useEffect(() => {
    if (project) {
      const admins: User[] = project.adminIds.map((adminId) => {
        const finedAdmin = allUsers?.find((x) => x.id == adminId);
        if (finedAdmin != null) {
          return finedAdmin;
        }
      });
      const members: User[] = project.memberIds.map((memberId) => {
        const finedMember = allUsers?.find((x) => x.id == memberId);
        if (finedMember != null) {
          return finedMember;
        }
      });
      const teams: Team[] = project.teamIds.map((teamId) => {
        const finedTeams = allTeams?.find((x) => x.id == teamId);
        if (finedTeams != null) {
          return finedTeams;
        }
      });

      reset({
        name: project?.name,
        description: project?.description,
        status: project?.status,
        admins: admins,
        members: members,
        teams: teams,
      });
    } else {
      reset(defaultValuesForm);
    }
  }, [project]);

  function handleCloseFormInComponent() {
    reset(defaultValuesForm);
    handleCloseForm();
  }
  const { data: users } = useGetAllUsers();
  const { data: teams } = useGetAllTeams();
  const { mutate: createProject } = useCreateProject();
  const { mutate: updateProject } = useUpdateProject();

  const onSubmit: SubmitHandler<ProjectForm> = (data) => {
    const idsOfAdmins: string[] = data.admins.map(function (v) {
      return v.id;
    });
    const idsOfMembers: string[] = data.members.map(function (v) {
      return v.id;
    });
    const idsOfTeams: string[] = data.teams.map(function (v) {
      return v.id;
    });

    if (!project) {
      createProject({
        adminIds: idsOfAdmins,
        memberIds: idsOfMembers,
        teamIds: idsOfTeams,
        description: data.description,
        name: data.name,
        status: data.status,
      });
    } else {
      updateProject({
        id: project.id,
        name: data.name,
        status: data.status,
        adminIds: idsOfAdmins,
        teamIds: idsOfTeams,
        memberIds: idsOfMembers,
        description: data.description,
        createdAt: project.createdAt,
      });
    }

    reset(defaultValuesForm);
  };

  return (
    <>
      <Dialog open={openFrom} onClose={handleCloseFormInComponent}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>{!project ? "Create" : "Edit"} Project</DialogTitle>
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
                    value={value}
                    options={users as readonly User[]}
                    getOptionLabel={(option) =>
                      option.firstName + " " + option.lastName
                    }
                    renderInput={(params) => (
                      <TextField
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
                    value={value}
                    onChange={(event, value) => {
                      onChange(value);
                    }}
                    options={users as readonly User[]}
                    getOptionLabel={(option) =>
                      option.firstName + " " + option.lastName
                    }
                    renderInput={(params) => (
                      <TextField
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
                    value={value}
                    onChange={(event, value) => onChange(value)}
                    options={teams as readonly Team[]}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => (
                      <TextField {...params} variant="standard" label="Teams" />
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
            <Button onClick={handleCloseFormInComponent}>Disagree</Button>
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
