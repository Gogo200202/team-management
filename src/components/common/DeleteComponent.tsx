import { Box, Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { type Dispatch, type FunctionComponent } from "react";

import { useDeleteTeam } from "../../api/teamController";
import type { Team } from "../../api/teamTypes";

type DeleteProps = {
  team: Team;

  open: boolean;

  handleClose: () => void;
  handleOpenSnack: () => void;
  typeOfToDelete: string;
  setTeamToDelete: Dispatch<React.SetStateAction<Team | undefined>>;
};

const DeleteComponent: FunctionComponent<DeleteProps> = ({
  open,
  team,
  typeOfToDelete,
  handleOpenSnack,
  handleClose,
  setTeamToDelete,
}) => {
  const { mutate: deleteTeam } = useDeleteTeam();

  const handleDelete = async () => {
    const lastTeam = team;
    if (typeOfToDelete == "Team") {
      deleteTeam(team.id);
    }

    handleOpenSnack();

    handleClose();
    setTeamToDelete(lastTeam);
  };

  return (
    <>
      <Box>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
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
    </>
  );
};

export default DeleteComponent;
