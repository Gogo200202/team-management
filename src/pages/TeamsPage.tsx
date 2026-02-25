import { Box, Button, Grid, Typography } from "@mui/material";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useState } from "react";

import { teamKeys, useDeleteTeam, useGetAllTeams } from "../api/teamController";
import type { Team } from "../api/types/teamTypes";
import type { User } from "../api/types/userTypes";
import { useGetAllUsers } from "../api/user.controller";
import DeleteComponent from "../components/common/DeleteComponent";
import { SnackbarComponent } from "../components/common/SnackbarComponent";
import TeamCard, {
  type TeamCardProps,
} from "../components/views/Teams/TeamCard";
import TeamFormComponent from "../components/views/Teams/TeamFormComponent";

export type TeamForm = {
  teamName: string;
  users: User[];
};
dayjs.extend(utc);
dayjs.extend(timezone);

export const TeamsPage = () => {
  const { data: selectUsers = [] } = useGetAllUsers();
  const { mutate: deleteTeam } = useDeleteTeam();
  const { data: allTeams = [] } = useGetAllTeams();
  const [teamToDelete, setTeamToDelete] = useState<Team | undefined>();
  const [open, setOpen] = useState<boolean>(false);
  const [openSnack, setOpenSnack] = useState<boolean>(false);
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);

  const deleteTeamFunction = () => {
    setTeamToDelete(teamToDelete);
    deleteTeam(teamToDelete!.id);
  };

  const teamsCard: TeamCardProps[] = [];

  function getUserFromTeam(team: Team): (User | undefined)[] {
    const idsOfUsers = team.users;
    if (!idsOfUsers) {
      return [];
    }

    const users: (User | undefined)[] = idsOfUsers.map((idsOfUser) => {
      const user = selectUsers.find((x) => x.id == idsOfUser);
      if (user != undefined) {
        return user;
      }
    });

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
    // eslint-disable-next-line react-hooks/immutability
    currentTeamProp.createdAt = getTime(allTeams[i].createdAt);
    // eslint-disable-next-line react-hooks/immutability
    currentTeamProp.updatedAt = getTime(allTeams[i].updatedAt);

    const currentTeam: TeamCardProps = {
      team: currentTeamProp,
      allUsers: selectUsers,
      teamUsers: getUserFromTeam(allTeams[i]),
    };

    teamsCard.push(currentTeam);
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "2/3",
        }}
      >
        <Typography textAlign={"center"}>Teams Page</Typography>

        <TeamFormComponent
          allUsers={selectUsers}
          openDialog={open}
          setOpenDialog={setOpen}
        />

        <Button variant="outlined" onClick={() => setOpen(true)}>
          Add new team
        </Button>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={25} columns={3}>
          {teamsCard.map((team, index) => (
            <TeamCard
              handelOpenDeleteDialog={() => setDeleteDialog(true)}
              key={index}
              team={team.team}
              allUsers={team.allUsers}
              teamUsers={team.teamUsers}
              handleDeleteClick={() => setTeamToDelete(team.team)}
            />
          ))}
        </Grid>
      </Box>

      {teamToDelete && (
        <DeleteComponent
          deleteItem={() => deleteTeamFunction()}
          openDeleteDialog={deleteDialog}
          handleCloseDelete={() => setDeleteDialog(false)}
          handleOpenSnack={() => setOpenSnack(true)}
          whatToDelete="team"
        />
      )}

      {teamToDelete && (
        <SnackbarComponent
          handelClose={() => setOpenSnack(false)}
          keysForQuery={teamKeys.allTeams}
          lastItem={teamToDelete}
          open={openSnack}
          typeOfAlert={"delete"}
        />
      )}
    </Box>
  );
};
