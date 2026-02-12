import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { Team } from "../../api/teamTypes";
import { useState, type FunctionComponent } from "react";
import EditIcon from "@mui/icons-material/Edit";
import { Form } from "react-router-dom";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import type { TeamForm } from "../../pages/TeamsPage";
import { useDeleteTeam, useUpdateTeam } from "../../api/teamController";
import type { User } from "../../api/userTypes";

export class TeamCardProps {
  team: Team;
  teamUsers: User[];
  allUsers: User[];
  constructor(t: Team, u: User[], uAll: User[]) {
    this.team = t;
    this.teamUsers = u;
    this.allUsers = uAll;
  }
}

export const TeamCard: FunctionComponent<TeamCardProps> = ({
  team,
  teamUsers,
  allUsers,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const { handleSubmit, control } = useForm<TeamForm>();
  const { mutate } = useUpdateTeam();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { mutate: deleteTeam } = useDeleteTeam();
  const onSubmit: SubmitHandler<TeamForm> = (data) => {
    const idsOfUser: number[] = data.Users.map(function (v) {
      return v.id;
    });

    mutate({
      id: team.id,
      name: data.TeamName,
      createdAt: team.createdAt,
      users: idsOfUser,
      updatedAt: new Date().toISOString(),
    });
  };

  const [openDelete, setOpenDelete] = useState(false);

  const handleClickOpenDelete = () => {
    setOpenDelete(true);
  };

  const handleCloseDelete = (e: any) => {
    if (e.nativeEvent.target.textContent == "Agree") {
      deleteTeam(team.id);
    }
    setOpenDelete(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {team.name}
        </Typography>
        <Box textAlign={"center"} sx={{ color: "text.secondary" }}>
          {teamUsers.map((user, index) => (
            <Box key={index}>{user.firstName}</Box>
          ))}
          <Box>createdAt: {team.createdAt}</Box>
          <Box>updatedAt: {team.updatedAt}</Box>

          <Grid rowSpacing={1}>
            <Button variant="outlined" onClick={handleClickOpenDelete}>
              delete
            </Button>

            <Button
              onClick={handleClickOpen}
              variant="contained"
              endIcon={<EditIcon />}
            >
              Edit
            </Button>
          </Grid>
        </Box>
      </CardContent>
      <Dialog open={open} keepMounted onClose={handleClose}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>{"Edit teams " + team.name}</DialogTitle>
          <DialogContent>
            <Stack spacing={2}>
              <Controller
                control={control}
                name="TeamName"
                render={({ field: { onChange, value } }) => (
                  <TextField
                    defaultValue={team.name}
                    value={value}
                    label="Team name"
                    onChange={onChange}
                  />
                )}
              />
              <Controller
                control={control}
                name="Users"
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    multiple
                    options={allUsers}
                    getOptionLabel={(option) => option.firstName}
                    filterSelectedOptions
                    onChange={(_event, value) => onChange(value)}
                    defaultValue={teamUsers}
                    value={value}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="SelectUsers"
                        placeholder="Favorites"
                      />
                    )}
                  />
                )}
              />
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose}>Disagree edit</Button>
            <Button onClick={handleClose} type="submit">
              edit
            </Button>
          </DialogActions>
        </Form>
      </Dialog>

      <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Do you want to delete this team"}
        </DialogTitle>

        <DialogActions>
          <Button onClick={handleCloseDelete}>Disagree</Button>
          <Button onClick={handleCloseDelete} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default TeamCard;
