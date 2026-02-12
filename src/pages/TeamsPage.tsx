import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
  Autocomplete,
  Box,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import type { User } from "../api/userTypes";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { Form } from "react-router-dom";
import { useGetAllUsers } from "../api/userController";
import { useCreateTeams, useGetAllTeams } from "../api/teamController";
import TeamCard, { TeamCardProps } from "../components/common/TeamCard";
import type { Team } from "../api/teamTypes";

export type TeamForm = {
  TeamName: string;
  Users: User[];
};
dayjs.extend(utc);
dayjs.extend(timezone);

export const TeamsPage = () => {
  const { data: selectUsers = [] } = useGetAllUsers();
  const { mutate } = useCreateTeams();
  const { data: allTeams = [], refetch } = useGetAllTeams();

  if (allTeams.length == 0) {
    refetch();
  }
  const [open, setOpen] = useState<boolean>(false);

  const { handleSubmit, control } = useForm<TeamForm>();

  const teamsCard: TeamCardProps[] = [];

  function getUserFromTeam(team: Team): User[] {
    const idsOfUser = team.users;
    const users: User[] = [];
    for (let i = 0; i < idsOfUser.length; i++) {
      const user = selectUsers.find((x) => x.id == idsOfUser[i]);
      if (user != undefined) {
        users.push(user);
      }
    }

    return users;
  }

  function getTime(time: string): string {
    const timestampCreatedAt = time;
    const dayjsLocalCreatedAt = dayjs(timestampCreatedAt);
    const dayjsIstCreatedAt = dayjsLocalCreatedAt.tz(
      Intl.DateTimeFormat().resolvedOptions().timeZone,
    );
    return dayjsIstCreatedAt.format("YYYY-MM-DD HH:mm:ss");
  }

  for (let i = 0; i < allTeams.length; i++) {
    const currentTeamProp = allTeams[i];
    currentTeamProp.createdAt = getTime(allTeams[i].createdAt);
    currentTeamProp.updatedAt = getTime(allTeams[i].updatedAt);

    const currentTeam: TeamCardProps = new TeamCardProps(
      currentTeamProp,
      getUserFromTeam(allTeams[i]),
      selectUsers,
    );

    teamsCard.push(currentTeam);
  }

  const onSubmit: SubmitHandler<TeamForm> = (data) => {
    const idsOfUser: number[] = data.Users.map(function (v) {
      return v.id;
    });

    mutate({
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      name: data.TeamName,
      users: idsOfUser,
    });

    refetch();
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100vh",
        }}
      >
        <Typography textAlign={"center"}>Teams Page</Typography>

        <Button variant="outlined" onClick={handleClickOpen}>
          Add new team
        </Button>

        <Dialog open={open} keepMounted onClose={handleClose}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <DialogTitle>{"Create teams"}</DialogTitle>
            <DialogContent>
              <Stack spacing={2}>
                <Controller
                  control={control}
                  name="TeamName"
                  render={({ field: { onChange, value } }) => (
                    <TextField
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
                      options={selectUsers}
                      getOptionLabel={(option) => option.firstName}
                      filterSelectedOptions
                      onChange={(_event, value) => onChange(value)}
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
              <Button onClick={handleClose}>Disagree</Button>
              <Button onClick={handleClose} type="submit">
                Agree
              </Button>
            </DialogActions>
          </Form>
        </Dialog>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={25} columns={3}>
          {teamsCard.map((team, index) => (
            <TeamCard
              key={index}
              team={team.team}
              allUsers={team.allUsers}
              teamUsers={team.teamUsers}
              
            ></TeamCard>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};
