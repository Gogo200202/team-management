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

type AlertProps = {
  typeOfAlert: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};
export const AlertComponent: FunctionComponent<AlertProps> = ({
  typeOfAlert,
  open,
  setOpen,
}) => {
  const handleUndo = (reason?: SnackbarCloseReason) => {
    if (reason === "clickaway") {
      return;
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
        message={`You perform ${typeOfAlert}`}
        action={action}
      />
    </Box>
  );
};
