import { Box } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
export const LandingPage = () => {
  const navigate = useNavigate();
  if (localStorage.getItem("secretWord") == undefined) {

    useEffect(() => {
       navigate("/auth/logIn");
    }, []);
  }

  return <Box>Landing</Box>;
};
