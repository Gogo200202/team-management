import { Box, Button, Dialog, DialogActions, DialogTitle } from "@mui/material";

import type { InterfaceItemDetail } from "../../api/interface/interfaceItemDetail";
import { projectKeys } from "../../api/projectController";
import { teamKeys } from "../../api/teamController";

interface DeleteProps<T extends InterfaceItemDetail> {
  item: T | undefined;
  openDeleteDialog: boolean;
  handleCloseDelete: () => void;
  handleOpenSnack: () => void;
  typeOfToDelete: string[];
  setItemToUndoDelete: (item: T | undefined) => void;
  deleteItemFromSet: () => void;
  deleteItem: () => void;
}

function DeleteComponent<T extends InterfaceItemDetail>({
  openDeleteDialog,
  item,
  typeOfToDelete,
  handleOpenSnack,
  handleCloseDelete,
  setItemToUndoDelete,
  deleteItemFromSet,
  deleteItem,
}: DeleteProps<T>) {
  let whatToDelete = "";
  if (typeOfToDelete == teamKeys.allTeams) {
    whatToDelete = "team";
  } else if (typeOfToDelete == projectKeys.allProjects) {
    whatToDelete = "project";
  }
  const handleDelete = () => {
    const lastItem = item;

    deleteItemFromSet();
    deleteItem();

    handleOpenSnack();
    handleCloseDelete();
    setItemToUndoDelete(lastItem);
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
}

export default DeleteComponent;
