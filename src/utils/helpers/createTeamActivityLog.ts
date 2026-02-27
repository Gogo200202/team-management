import type { ActivityLog } from "../../api/types/activityLog";
import type { Team } from "../../api/types/teamTypes";
import type { User } from "../../api/types/userTypes";

export type TeamWithUsers = Omit<Team, "users"> & {
  users: User[];
};

export type TeamTypeOfLog = Omit<ActivityLog, "loggedInData"> & {
  team: Team;
};
export type TeamActivityLog = Omit<ActivityLog, "loggedInData"> & {
  loggedInData: TeamWithUsers;
};

export function createTeamsActivityLogs(
  allActivityLog: ActivityLog[],
  allUsers: User[],
) {
  const teams: TeamActivityLog[] = allActivityLog
    .filter((x) => x.typeOfData == "Team")
    .map((x) => {
      return {
        createdAt: x.createdAt,
        id: x.id,
        typeOfData: x.typeOfData,
        typeOfLogin: x.typeOfLogin,
        team: JSON.parse(x.loggedInData) as Team,
      } as TeamTypeOfLog;
    })
    .map((i) => {
      const users: User[] = i.team.users.map((userId) => {
        const resultUser = allUsers?.find((g) => g.id == userId);
        if (resultUser != undefined) {
          return resultUser;
        }
      });
      const team: TeamWithUsers = {
        users: users,
        createdAt: i.team.createdAt,
        id: i.team.id,
        name: i.team.name,
        updatedAt: i.team.updatedAt,
      };

      return {
        id: i.id,
        loggedInData: team,
        createdAt: i.createdAt,
        typeOfData: i.typeOfData,
        typeOfLogin: i.typeOfLogin,
      };
    });

  return teams;
}

export function createTeamActivityLogWithId(
  allActivityLog: ActivityLog[],
  allUsers: User[],
  idOfTeam: string,
) {
  const teams: TeamActivityLog[] = allActivityLog
    .filter((x) => JSON.parse(x.loggedInData).id == idOfTeam)
    .map((x) => {
      return {
        createdAt: x.createdAt,
        id: x.id,
        typeOfData: x.typeOfData,
        typeOfLogin: x.typeOfLogin,
        team: JSON.parse(x.loggedInData) as Team,
      } as TeamTypeOfLog;
    })
    .map((i) => {
      const users: User[] = i.team.users.map((userId) => {
        const resultUser = allUsers?.find((g) => g.id == userId);
        if (resultUser != undefined) {
          return resultUser;
        }
      });
      const team: TeamWithUsers = {
        users: users,
        createdAt: i.team.createdAt,
        id: i.team.id,
        name: i.team.name,
        updatedAt: i.team.updatedAt,
      };

      return {
        id: i.id,
        loggedInData: team,
        createdAt: i.createdAt,
        typeOfData: i.typeOfData,
        typeOfLogin: i.typeOfLogin,
      };
    });

  return teams;
}

export function createTeamActivityLog(
  allActivityLog: ActivityLog[],
  allUsers: User[],
  id: string,
) {
  const teamLog: ActivityLog = allActivityLog.find((a) => a.id == id)!;
  const parsTeamData = JSON.parse(teamLog.loggedInData) as Team;
  const team: TeamActivityLog = {
    createdAt: teamLog.createdAt,
    id: teamLog.id,
    typeOfData: teamLog.typeOfData,
    typeOfLogin: teamLog.typeOfLogin,
    loggedInData: {
      id: parsTeamData.id,
      createdAt: parsTeamData.createdAt,
      name: parsTeamData.name,
      updatedAt: parsTeamData.updatedAt,
      users: parsTeamData.users.map((idOfUser) => {
        const resultUser = allUsers?.find((g) => g.id == idOfUser);
        if (resultUser != undefined) {
          return resultUser;
        }
      }),
    },
  };

  return team;
}
