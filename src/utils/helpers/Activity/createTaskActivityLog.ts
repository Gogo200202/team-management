import type { ActivityLog } from "../../../api/types/activityLog";
import type { Project } from "../../../api/types/projectTypes";
import type { Task } from "../../../api/types/taskType";
import type { User } from "../../../api/types/userTypes";

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

export interface ActivityWithTaskWithDataAndUpdate extends ActivityWithTaskWithData {
  update: string;
};

type ActivityWithTask = Omit<ActivityLog, "loggedInData"> & {
  loggedInData: Task;
};

export function createTaskActivityLog(
  allActivityLog: ActivityLog[],
  allUsers: User[],
  allProjects: Project[],
): ActivityWithTaskWithData[] {
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
):ActivityWithTaskWithDataAndUpdate[] {
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

    const updates: string[] = [""];
      for (let i = 0; i <= task.length; i++) {
        let update: string = "";
        if (task[i + 1] == undefined) {
          if (task[i].typeOfLogin == "Delete") {
            updates[i] = "";
          }
          break;
        }
        if (task[i].typeOfLogin == "Delete") {
          break;
        }
    
        const task1 = task[i].loggedInData;
        const task2 = task[i + 1].loggedInData;
      if (task1.title !== task2.title) {
        update += `Title changed from ${task1.title} to ${task2.title}`;
      }
      if (task1.description !== task2.description) {
        update += ` Description changed from ${task1.description} to ${task2.description}`;
      }
      if (task1.status !== task2.status) {
        update += ` Status changed from ${task1.status} to ${task2.status}`;
      }
      if (task1.priority !== task2.priority) {
        update += ` Priority changed from ${task1.priority} to ${task2.priority}`;
      }
      if (task1.finishUntil !== task2.finishUntil) {
        update += ` Finish until changed from ${task1.finishUntil} to ${task2.finishUntil}`;
      }

      if (task1.assignedUser !== task2.assignedUser) {
        update += ` Assigned user changed from ${task1.assignedUser.firstName}  to ${task2.assignedUser.firstName}`;
      }

      if (task1.reporter !== task2.reporter) {
        update += ` Reporter changed from ${task1.reporter.firstName}  to ${task2.reporter.firstName} `;
      }


        updates.push(update);
      }

      const taskWithUpdate: ActivityWithTaskWithDataAndUpdate[] = task.map((t, index) => {
        return {
          id: t.id,
          createdAt: t.createdAt,
          typeOfData: t.typeOfData,
          typeOfLogin: t.typeOfLogin,
          loggedInData: t.loggedInData,
          update: updates[index],
        } as ActivityWithTaskWithDataAndUpdate;
      });

  return taskWithUpdate;
}
