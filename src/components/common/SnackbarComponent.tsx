import CloseIcon from "@mui/icons-material/Close";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Snackbar, { type SnackbarCloseReason } from "@mui/material/Snackbar";
import { type FunctionComponent } from "react";

import {
  taskKeys,
  useCreateTask,
  useUpdateTask,
} from "../../api/taskController";
import {
  teamKeys,
  useCreateTeams,
  useDeleteTeam,
  useUpdateTeam,
} from "../../api/teamController";

export type AlertProps = {
  typeOfAlert: string;
  open: boolean;
  handelClose: () => void;
  lastItem: any;
  keysForQuery: string[];
};
export const SnackbarComponent: FunctionComponent<AlertProps> = ({
  typeOfAlert,
  open,
  handelClose,
  lastItem,
  keysForQuery,
}) => {
  const { mutate: deleteTeam } = useDeleteTeam();
  const { mutate: updateTeam } = useUpdateTeam();
  const { mutate: createTeam } = useCreateTeams();
  const { mutate: createTask } = useCreateTask();
  const { mutate: updateTask } = useUpdateTask();

  const handleUndo = (reason?: SnackbarCloseReason) => {
    if (reason === "clickaway") {
      return;
    }

    if (keysForQuery == teamKeys.allTeams) {
      if (typeOfAlert == "create") {
        deleteTeam(lastItem.id);
      } else if (typeOfAlert == "edit") {
        updateTeam(lastItem);
      } else if (typeOfAlert == "delete") {
        createTeam(lastItem);
      }
    } else if (keysForQuery == taskKeys.allTasks) {
      if (typeOfAlert == "delete") {
        createTask(lastItem);
      } else if (typeOfAlert == "edit") {
        updateTask(lastItem);
      }
    }

    handelClose();
  };
  const handleClose = (reason?: SnackbarCloseReason) => {
    if (reason === "clickaway") {
      return;
    }

    handelClose();
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
