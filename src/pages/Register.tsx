import { Box, TextField, Stack, Button } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCreateUser } from "../api/userController";
import { useUserContext } from "../components/context/UserContext";

export const Register = () => {
  const navigate = useNavigate();
  const { handleLogin } = useUserContext();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { mutate } = useCreateUser();

  function tryRegister() {
    handleLogin({
      email: email,
      secretWord: password,
      userName: firstName + " " + lastName,
    });

    mutate({
      displayName: firstName + " " + lastName,
      email: email,
      firstName: firstName,
      lastName: lastName,
      createdAt: new Date().toISOString(),
      secretWord: password,
      updatedAt: new Date().toISOString(),
    });

    navigate("/");
  }

  return (
    <Box>
      <Stack sx={{ position: "absolute", left: "40%", top: "20%" }} spacing={2}>
        <TextField
          onChange={(e) => setFirstName(e?.target?.value)}
          id="outlined-basic"
          label="firstName"
          variant="outlined"
        />
        <TextField
          onChange={(e) => setLastName(e?.target?.value)}
          id="outlined-basic"
          label="lastName"
          variant="outlined"
        />
        <TextField
          onChange={(e) => setEmail(e?.target?.value)}
          id="outlined-basic"
          label="email"
          variant="outlined"
        />
        <TextField
          onChange={(e) => setPassword(e?.target?.value)}
          id="outlined-basic"
          label="password"
          variant="outlined"
        />
        <Link to="/auth/login">Log in</Link>
        <Button variant="contained" onClick={tryRegister}>
          Register
        </Button>
      </Stack>
    </Box>
  );
};
