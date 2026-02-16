import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Snackbar, { type SnackbarCloseReason } from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {
  type Dispatch,
  type FunctionComponent,
  type SetStateAction,
} from "react";
import React from "react";
import {
  teamKeys,
  useCreateTeams,
  useDeleteTeam,
  useUpdateTeam,
} from "../../api/teamController";
import type { Team } from "../../api/teamTypes";

type AlertProps = {
  typeOfAlert: string;
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
      if (typeOfAlert == "Create") {
        deleteTeam(lastTeam.id);
      } else if (typeOfAlert == "Edit") {
        updateTeam(lastTeam);
      } else if (typeOfAlert == "Delete") {
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
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleUndo}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
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
