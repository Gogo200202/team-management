import { Box, Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import type { FunctionComponent } from "react";

type DeleteProps = {
  openDeleteDialog: boolean;
  handleCloseDelete: () => void;
  handleOpenSnack: () => void;
  deleteItem: () => void;
  whatToDelete: string;
};

const DeleteComponent: FunctionComponent<DeleteProps> = ({
  openDeleteDialog,
  handleOpenSnack,
  handleCloseDelete,
  deleteItem,
  whatToDelete,
}) => {
  const handleDelete = () => {
    deleteItem();
    handleOpenSnack();
    handleCloseDelete();
  };

  return (
    <>
      <Box>
        <Dialog open={openDeleteDialog} onClose={handleCloseDelete}>
          <DialogTitle>
            {"Do you want to delete this " + whatToDelete}
          </DialogTitle>

          <DialogActions>
            <Button onClick={handleCloseDelete}>Disagree</Button>
            <Button onClick={handleDelete} autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default DeleteComponent;
