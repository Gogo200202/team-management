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
  useState,
} from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { Form } from "react-router-dom";

import {
  teamKeys,
  useCreateTeams,
  useUpdateTeam,
} from "../../../api/teamController";
import type { Team } from "../../../api/types/teamTypes";
import type { User } from "../../../api/types/userTypes";
import type { TeamForm } from "../../../pages/TeamsPage";
import type { AlertProps } from "../../common/SnackbarComponent";
import { SnackbarComponent } from "../../common/SnackbarComponent";

type TeamFormDialog = {
  allUsers: User[];
  team?: Team;
  selectedUsers?: User[];
  openDialog: boolean;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
};

export const TeamFormComponent: FunctionComponent<TeamFormDialog> = ({
  allUsers,
  selectedUsers = [],
  team,
  openDialog,
  setOpenDialog,
}) => {
  type AlertTypeOfAlert = Pick<AlertProps, "typeOfAlert">;
  const dialogText: AlertTypeOfAlert = { typeOfAlert: "create" };
  if (!team) {
    dialogText.typeOfAlert = "create";
  } else {
    dialogText.typeOfAlert = "edit";
  }

  const [openSnack, setOpenSnack] = useState<boolean>(false);

  const [newTeam, setNewTeam] = useState<Team>();
  const { mutateAsync: createTeam } = useCreateTeams();
  const { mutate: updateTeam } = useUpdateTeam();
  const { handleSubmit, control, reset } = useForm<TeamForm>({
    defaultValues: { teamName: team?.name || "", users: selectedUsers || [] },
  });

  const handleClose = () => {
    if (!team) {
      reset();
    }
    setOpenDialog(false);
  };

  const onSubmit: SubmitHandler<TeamForm> = async ({ teamName, users }) => {
    const idsOfUser: number[] = users.map(function (v) {
      return v.id;
    });

    if (team) {
      setNewTeam(team);
      updateTeam({
        id: team.id,
        createdAt: team.createdAt,
        name: teamName,
        users: idsOfUser,
      });
    } else {
      const Newdata = await createTeam({
        name: teamName,
        users: idsOfUser,
      });
      setNewTeam(Newdata);
    }
    setOpenSnack(true);

    handleClose();
  };

  return (
    <>
      <Dialog open={openDialog} keepMounted onClose={handleClose} maxWidth="xl">
        <DialogTitle>{dialogText.typeOfAlert + " team"}</DialogTitle>
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
            <Button type="submit">Agree</Button>
          </DialogActions>
        </Form>
      </Dialog>
      <SnackbarComponent
        open={openSnack}
        setOpen={setOpenSnack}
        typeOfAlert={dialogText.typeOfAlert}
        lastTeam={newTeam}
        keysForQuery={teamKeys.allTeams}
      />
    </>
  );
};
export default TeamFormComponent;
