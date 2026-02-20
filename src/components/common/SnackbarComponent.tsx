import CloseIcon from "@mui/icons-material/Close";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Snackbar, { type SnackbarCloseReason } from "@mui/material/Snackbar";
import {
  type Dispatch,
  type FunctionComponent,
  type SetStateAction,
} from "react";

import {
  teamKeys,
  useCreateTeams,
  useDeleteTeam,
  useUpdateTeam,
} from "../../api/teamController";
import type { Team } from "../../api/types/teamTypes";

export type AlertProps = {
  typeOfAlert: "create" | "edit" | "delete";
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  lastTeam: Team;
  keysForQuery: string[];
};
export const SnackbarComponent: FunctionComponent<AlertProps> = ({
  typeOfAlert,
  open,
  setOpen,
  lastTeam,
  keysForQuery,
}) => {
  const { mutate: deleteTeam } = useDeleteTeam();
  const { mutate: updateTeam } = useUpdateTeam();
  const { mutate: createTeam } = useCreateTeams();

  const handleUndo = (reason?: SnackbarCloseReason) => {
    if (reason === "clickaway") {
      return;
    }

    if (keysForQuery == teamKeys.allTeams) {
      if (typeOfAlert == "create") {
        deleteTeam(lastTeam.id);
      } else if (typeOfAlert == "edit") {
        updateTeam(lastTeam);
      } else if (typeOfAlert == "delete") {
        createTeam(lastTeam);
      }
    }

    setOpen(false);
  };
  const handleClose = (reason?: SnackbarCloseReason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const action = (
    <>
      <Button color="secondary" size="small" onClick={handleUndo}>
        UNDO
      </Button>
      <IconButton size="small" color="inherit" onClick={handleClose}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  return (
    <Box>
      <Snackbar
        open={open}
        autoHideDuration={1500}
        onClose={handleClose}
        message={`You perform ${typeOfAlert} action`}
        action={action}
      />
    </Box>
  );
};
