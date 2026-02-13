import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Box, Button, Grid, Typography } from "@mui/material";
import type { User } from "../api/userTypes";
import { useGetAllUsers } from "../api/userController";
import { useGetAllTeams } from "../api/teamController";
import TeamCard, { type TeamCardProps } from "../components/common/TeamCard";
import type { Team } from "../api/teamTypes";
import TeamFormComponent from "../components/common/TeamFormComponent";
import { useState } from "react";

export type TeamForm = {
  teamName: string;
  users: User[];
};
dayjs.extend(utc);
dayjs.extend(timezone);

export const TeamsPage = () => {
  const { data: selectUsers = [] } = useGetAllUsers();

  const { data: allTeams = [] } = useGetAllTeams();

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

    const currentTeam: TeamCardProps = {
      team: currentTeamProp,
      allUsers: selectUsers,
      teamUsers: getUserFromTeam(allTeams[i]),
    };

    teamsCard.push(currentTeam);
  }
  const [open, setOpen] = useState<boolean>(false);

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

        <TeamFormComponent
          allUsers={selectUsers}
          selectedUsers={[]}
          OpenDialog={open}
          setOpenDialog={setOpen}
        ></TeamFormComponent>
        
        <Button variant="outlined" onClick={() => setOpen(true)}>
          Add new team
        </Button>
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
