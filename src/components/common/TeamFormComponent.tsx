import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import {
  type Dispatch,
  type FunctionComponent,
  type SetStateAction,
} from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { Form } from "react-router-dom";
import { useCreateTeams, useUpdateTeam } from "../../api/teamController";
import type { TeamForm } from "../../pages/TeamsPage";
import type { User } from "../../api/userTypes";
import type { Team } from "../../api/teamTypes";

type TeamFormDialog = {
  allUsers: User[];
  team?: Team;
  selectedUsers?: User[];
  OpenDialog: boolean;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
};

export const TeamFormComponent: FunctionComponent<TeamFormDialog> = ({
  allUsers,
  selectedUsers = [],
  team,
  OpenDialog,
  setOpenDialog,
}) => {
  const { mutate: createTeam } = useCreateTeams();
  const { mutate: updateTeam } = useUpdateTeam();
  const { handleSubmit, control } = useForm<TeamForm>({
    defaultValues: { teamName: team?.name || "", users: selectedUsers || [] },
  });

  const onSubmit: SubmitHandler<TeamForm> = async ({ teamName, users }) => {
    const idsOfUser: number[] = users.map(function (v) {
      return v.id;
    });

    if (team) {
      updateTeam({
        id: team.id,
        createdAt: team.createdAt,
        name: teamName,
        users: idsOfUser,
      });
    } else {
      createTeam({
        name: teamName,
        users: idsOfUser,
      });
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <Dialog open={OpenDialog} keepMounted onClose={handleClose} maxWidth="xl">
        <DialogTitle>{"Create teams"}</DialogTitle>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Stack spacing={2} mt={2} width="100%">
              <Controller
                control={control}
                name="teamName"
                render={({ field: { onChange, value } }) => (
                  <TextField
                    value={value}
                    label="Team name"
                    fullWidth
                    onChange={onChange}
                  />
                )}
              />
              <Controller
                control={control}
                name="users"
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    multiple
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
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose}>Disagree</Button>
            <Button onClick={handleClose} type="submit">
              Agree
            </Button>
          </DialogActions>
        </Form>
      </Dialog>
    </>
  );
};
export default TeamFormComponent;
