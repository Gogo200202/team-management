import type { User } from "../../../api/types/userTypes";

export function editLogBetweenUser(users1: User[], users2: User[]): string {
  let update = "";
  let userRemove = "";
  let userAdded = "";

  if (users1 != users2) {
    users2
      .filter((e) => !users1.includes(e))
      .map((x) => {
        userAdded += `${x.firstName} `;
      });

    users1
      .filter((e) => !users2.includes(e))
      .map((x) => {
        userRemove += `${x.firstName} `;
      });
  }

  if (userAdded.length != 0) {
    update += `added ${userAdded}`;
  }

  if (userRemove.length != 0) {
    update += `remove ${userRemove}`;
  }
  return update;
}
