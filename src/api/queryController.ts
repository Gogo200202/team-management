// allUsers allTeams

import { lastChangeTeamAction } from "../config/queryClient.config";
import { teamKeys } from "./teamController";

export const undoLastActionTeam = (
  key: string[],
  action: string,
  id: number,
) => {
  action = action.toLocaleLowerCase();

  if (action == "create") {
    if (key == teamKeys.allTeams) {
      console.log(key);
      console.log(action);
      console.log(id);
      console.log(lastChangeTeamAction);
    }
  }
};
