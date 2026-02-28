import type { ActivityLog } from "../../api/types/activityLog";
import type { Project } from "../../api/types/projectTypes";
import type { Team } from "../../api/types/teamTypes";
import type { User } from "../../api/types/userTypes";
import { editLogBetweenUser } from "./editLogBetweenUser";

type ProjectActivity = Omit<ActivityLog, "loggedInData"> & {
  loggedInData: Project;
};

type ProjectWithData = Omit<Project, "adminIds" | "memberIds" | "teamIds"> & {
  admins: User[];
  members: User[];
  teams: Team[];
};

export type ProjectActivityWithAllData = Omit<ActivityLog, "loggedInData"> & {
  loggedInData: ProjectWithData;
};

export interface ProjectActivityWithAllDataWithUpdate extends ProjectActivityWithAllData {
  update: string[];
}

export function createProjectActivityLog(
  allActivityLog: ActivityLog[],
  allTeams: Team[],
  allUsers: User[],
) {
  const project = allActivityLog
    .filter((x) => x.typeOfData == "Project")
    .map((x) => {
      return {
        ...x,
        loggedInData: JSON.parse(x.loggedInData),
      } as ProjectActivity;
    })
    .map((x) => {
      const admins = x.loggedInData.adminIds.map((a) => {
        return allUsers.find((au) => au.id == a);
      });

      const members = x.loggedInData.memberIds.map((m) => {
        return allUsers.find((au) => au.id == m);
      });

      const teamsProject = x.loggedInData.teamIds.map((t) => {
        return allTeams.find((au) => au.id == t);
      });

      const allDataMappedProject: ProjectWithData = {
        ...x.loggedInData,
        admins: admins,
        members: members,
        teams: teamsProject,
      };

      return {
        ...x,
        loggedInData: allDataMappedProject,
      } as ProjectActivityWithAllData;
    });

  return project;
}

export function createProjectActivityLogWithId(
  allActivityLog: ActivityLog[],
  allTeams: Team[],
  allUsers: User[],
  id: string,
) {
  const project = allActivityLog
    .filter((x) => x.typeOfData == "Project")
    .map((x) => {
      return {
        ...x,
        loggedInData: JSON.parse(x.loggedInData),
      } as ProjectActivity;
    })
    .filter((x) => x.loggedInData.id == id)
    .map((x) => {
      const admins = x.loggedInData.adminIds.map((a) => {
        return allUsers.find((au) => au.id == a);
      });

      const members = x.loggedInData.memberIds.map((m) => {
        return allUsers.find((au) => au.id == m);
      });

      const teamsProject = x.loggedInData.teamIds.map((t) => {
        const team = allTeams.find((au) => au.id == t);

        if (team != null) {
          return team;
        }

        return;
      });

      const allDataMappedProject: ProjectWithData = {
        ...x.loggedInData,
        admins: admins,
        members: members,
        teams: teamsProject,
      };

      return {
        ...x,
        loggedInData: allDataMappedProject,
      } as ProjectActivityWithAllData;
    });

  const updates: string[] = [""];
  for (let i = 0; i <= project.length; i++) {
    let update: string = "";
    if (project[i + 1] == undefined) {
      if (project[i].typeOfLogin == "Delete") {
        updates[i] = "";
      }
      break;
    }
    if (project[i].typeOfLogin == "Delete") {
      break;
    }

    const resultAdmins = editLogBetweenUser(
      project[i].loggedInData.admins,
      project[i + 1].loggedInData.admins,
    );
    const resultMembers = editLogBetweenUser(
      project[i].loggedInData.members,
      project[i + 1].loggedInData.members,
    );
    if (resultAdmins.length != 0) {
      update += "Admins " + resultAdmins;
    }
    if (resultMembers.length != 0) {
      update += "Members " + resultMembers;
    }

    let addedTeam = "";
    let removedTeam = "";

    if (project[i].loggedInData.teams != project[i + 1].loggedInData.teams) {
      project[i + 1].loggedInData.teams
        .filter((e) => !project[i].loggedInData.teams.includes(e))
        .map((x) => {
          addedTeam += `${x.name} `;
        });
      project[i].loggedInData.teams
        .filter((e) => !project[i + 1].loggedInData.teams.includes(e))
        .map((x) => {
          removedTeam += `${x.name} `;
        });

      if (addedTeam.length != 0) {
        update += "Teams added " + addedTeam;
      }
      if (removedTeam.length != 0) {
        update += "Teams removed " + removedTeam;
      }
    }

    updates.push(update);
  }

  const projectWithUpdateData: ProjectActivityWithAllDataWithUpdate =
    project.map((x) => {
      return { ...x, update: updates };
    });

  return projectWithUpdateData;
}
