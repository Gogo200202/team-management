import { Box, TextField, Stack, Button } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGetAllUsers } from "../api/userController";

export const LogInPage = () => {
  const { data = [] } = useGetAllUsers();

  const navigate = useNavigate();
  const [message, setMessage] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  async function logIn() {
    const user = data.find((x) => x.email == email);

    if (typeof user === "undefined") {
      setMessage(true);
      return;
    }

    if (user.secretWord == password) {
      localStorage.setItem("userName", user.displayName);
      localStorage.setItem("email", user.email);
      localStorage.setItem("secretWord", user.secretWord);

      navigate("/");
    }
  }

  return (
    <Box>
      <Stack sx={{ position: "absolute", left: "40%", top: "30%" }} spacing={2}>
        <TextField
          onChange={(e) => setEmail(e.target.value)}
          id="outlined-basic"
          label="Email"
          variant="outlined"
        />
        <TextField
          onChange={(e) => setPassword(e.target.value)}
          id="outlined-basic"
          label="Password"
          variant="outlined"
        />

        <Link to="/auth/register">Register</Link>

        <Button variant="contained" onClick={logIn}>
          Log in
        </Button>
        {message ? <div>not valid email or password</div> : <div></div>}
      </Stack>
    </Box>
  );
};
