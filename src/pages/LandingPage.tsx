import { Box } from "@mui/material";
import { useUserContext } from "../components/context/UserContext";

export const LandingPage = () => {
  const { currentUser } = useUserContext();

  console.log(currentUser);
  return <Box>Landing</Box>;
};
