import { Box, Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import {
  useState,
  type Dispatch,
  type FunctionComponent,
  type SetStateAction,
} from "react";
import { useDeleteTeam } from "../../api/teamController";
import { SnackbarComponent } from "./SnackbarComponent";

// deletion implementation
type DeleteProps = {
  open: boolean;
  title: string;
  onAgree: () => void;
 // handleClose: () => void;
  typeOfToDelete: string;
};

const DeleteComponent: FunctionComponent<DeleteProps> = ({
  open,
  setOpen,
  id,
  typeOfToDelete,
 // handleClose,
  onAgree,
  title
}) => {
  const [openSnack, setOpenSnack] = useState<boolean>(false);
  const { mutate: deleteTeam } = useDeleteTeam();
  const handleClose = async () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    if (typeOfToDelete == "Team") {
      deleteTeam(id);
    }
    setOpen(false);
    setOpenSnack(true);
  };
  return (
    <>
      <Box>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Do you want to delete this " + typeOfToDelete}
          </DialogTitle>

          <DialogActions>
            <Button onClick={handleClose}>Disagree</Button>
            <Button onClick={handleDelete} autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <SnackbarComponent
        open={openSnack}
        setOpen={setOpenSnack}
        typeOfAlert={"Delete"}
      />
    </>
  );
};

export default DeleteComponent;
