import type { ActivityLog } from "../../api/types/activityLog";
import type { Project } from "../../api/types/projectTypes";
import type { Task } from "../../api/types/taskType";
import type { User } from "../../api/types/userTypes";

type TaskWithData = Omit<
  Task,
  "projectId" | "reporterId" | "assignedUserId"
> & {
  project: Project;
  reporter: User;
  assignedUser: User;
};

export type ActivityWithTaskWithData = Omit<ActivityLog, "loggedInData"> & {
  loggedInData: TaskWithData;
};

type ActivityWithTask = Omit<ActivityLog, "loggedInData"> & {
  loggedInData: Task;
};

export function createTaskActivityLog(
  allActivityLog: ActivityLog[],
  allUsers: User[],
  allProjects: Project[],
) {
  const task = allActivityLog
    .filter((x) => x.typeOfData == "Task")
    .map((x) => {
      return {
        id: x.id,
        createdAt: x.createdAt,
        typeOfData: x.typeOfData,
        typeOfLogin: x.typeOfLogin,
        loggedInData: JSON.parse(x.loggedInData) as Task,
      } as ActivityWithTask;
    })
    .map((x) => {
      const assignedUser = allUsers?.find(
        (asUser) => asUser.id == x.loggedInData.assignedUserId,
      );
      const reporterUser = allUsers?.find(
        (repUser) => repUser.id == x.loggedInData.reporterId,
      );

      const project = allProjects?.find(
        (pr) => pr.id == x.loggedInData.projectId,
      );

      const currentTask: TaskWithData = {
        assignedUser: assignedUser,
        reporter: reporterUser,
        project: project,
        createdAt: x.loggedInData.createdAt,
        description: x.loggedInData.description,
        finishUntil: x.loggedInData.finishUntil,
        id: x.loggedInData.id,
        priority: x.loggedInData.priority,
        status: x.loggedInData.status,
        title: x.loggedInData.title,
        updatedAt: x.loggedInData.updatedAt,
      };

      return {
        id: x.id,
        createdAt: x.createdAt,
        typeOfData: x.typeOfData,
        typeOfLogin: x.typeOfLogin,
        loggedInData: currentTask,
      } as ActivityWithTaskWithData;
    });

  return task;
}

export function createTaskActivityLogWithId(
  allActivityLog: ActivityLog[],
  allUsers: User[],
  allProjects: Project[],
  idOfTask: string,
) {
  const task = allActivityLog
    .filter((x) => x.typeOfData == "Task")
    .map((x) => {
      return {
        id: x.id,
        createdAt: x.createdAt,
        typeOfData: x.typeOfData,
        typeOfLogin: x.typeOfLogin,
        loggedInData: JSON.parse(x.loggedInData) as Task,
      } as ActivityWithTask;
    })
    .filter((x) => x.loggedInData.id == idOfTask)
    .map((x) => {
      const assignedUser = allUsers?.find(
        (asUser) => asUser.id == x.loggedInData.assignedUserId,
      );
      const reporterUser = allUsers?.find(
        (repUser) => repUser.id == x.loggedInData.reporterId,
      );

      const project = allProjects?.find(
        (pr) => pr.id == x.loggedInData.projectId,
      );

      const currentTask: TaskWithData = {
        assignedUser: assignedUser,
        reporter: reporterUser,
        project: project,
        createdAt: x.loggedInData.createdAt,
        description: x.loggedInData.description,
        finishUntil: x.loggedInData.finishUntil,
        id: x.loggedInData.id,
        priority: x.loggedInData.priority,
        status: x.loggedInData.status,
        title: x.loggedInData.title,
        updatedAt: x.loggedInData.updatedAt,
      };

      return {
        id: x.id,
        createdAt: x.createdAt,
        typeOfData: x.typeOfData,
        typeOfLogin: x.typeOfLogin,
        loggedInData: currentTask,
      } as ActivityWithTaskWithData;
    });

  return task;
}
