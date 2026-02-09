import { Box, TextField, Stack, Button } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateUser } from "../api/userController";

export const Register = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { mutate } = useCreateUser();

  function tryRegister() {
    localStorage.setItem("userName", firstName + " " + lastName);
    localStorage.setItem("email", email);
    localStorage.setItem("secretWord", password);

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

        <Button variant="contained" onClick={tryRegister}>
          Register
        </Button>
        {message ? <div>not valid email or password</div> : <div></div>}
      </Stack>
    </Box>
  );
};
