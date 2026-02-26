import type { ActivityLog } from "../../api/types/activityLog";
import type { Project } from "../../api/types/projectTypes";
import type { Team } from "../../api/types/teamTypes";
import type { User } from "../../api/types/userTypes";

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
