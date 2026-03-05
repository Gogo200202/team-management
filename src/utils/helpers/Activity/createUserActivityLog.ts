import type { ActivityLog } from "../../../api/types/activityLog";
import type { User } from "../../../api/types/userTypes";

export type ActivityLogUser = Omit<ActivityLog, "loggedInData"> & {
  loggedInData: User;
};

export interface UpdatedActivityLogUser extends ActivityLogUser {
  update: string;
}

export function createUserActivityLog(allActivityLog: ActivityLog[]) {
  const users: ActivityLogUser[] = allActivityLog
    .filter((al) => al.typeOfData === "User")
    .map((al) => {
      return {
        ...al,
        loggedInData: JSON.parse(al.loggedInData) as User,
      };
    });

  return users;
}

export function createUserActivityLogWhitId(
  allActivityLog: ActivityLog[],
  idOfUser: string,
): UpdatedActivityLogUser[] {
  const users: ActivityLogUser[] = allActivityLog
    .filter((al) => al.typeOfData === "User")
    .map((al) => {
      return {
        ...al,
        loggedInData: JSON.parse(al.loggedInData) as User,
      };
    })
    .filter((al) => al.loggedInData.id == idOfUser);

  const updates: string[] = [""];
  for (let i = 0; i <= users.length; i++) {
    let update: string = "";
    if (users[i + 1] == undefined) {
      if (users[i].typeOfLogin == "Delete") {
        updates[i] = "";
      }
      break;
    }
    if (users[i].typeOfLogin == "Delete") {
      break;
    }
    const user1 = users[i].loggedInData;
    const user2 = users[i + 1].loggedInData;
    if (user1.firstName != user2.firstName) {
      update += `Name: ${user1.firstName} was changed to ${user2.firstName} `;
    }
    if (user1.lastName != user2.lastName) {
      update += `Last Name: ${user1.lastName} was changed to ${user2.lastName} `;
    }
    if (user1.email != user2.email) {
      update += `Email: ${user1.email} was changed to ${user2.email} `;
    }

    if (user1.secretWord != user2.secretWord) {
      update += `Secret Word: ${user1.secretWord} was changed to ${user2.secretWord} `;
    }

    updates.push(update);
  }

  const usersWithUpdates: UpdatedActivityLogUser[] = users.map(
    (user, index) => {
      return {
        ...user,
        update: updates[index],
      };
    },
  );

  return usersWithUpdates;
}
