import { Box, TextField, Stack, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCreateUser, useGetAllUsers } from "../api/user.controller";
import { useUserContext } from "../components/context/UserContext";

export const Register = () => {
  const navigate = useNavigate();
  const { handleLogin } = useUserContext();
  const { data = [] } = useGetAllUsers();

  const [notValidButton, setNotValidButton] = useState<boolean>(true);

  const [message, setMessage] = useState<string>("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [retypePassword, setRetypePassword] = useState<string>("");
  const { mutate } = useCreateUser();

  useEffect(() => {
    if (firstName.length == 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNotValidButton(true);

      return;
    }
    if (lastName.length == 0) {
      setNotValidButton(true);
      return;
    }
    if (email.length == 0) {
      setNotValidButton(true);
      return;
    }
    if (password.length == 0 || retypePassword.length == 0) {
      setNotValidButton(true);
      return;
    }
    if (password == retypePassword) {
      setNotValidButton(false);
    } else {
      setNotValidButton(true);
    }
  }, [password, retypePassword, firstName, lastName, email]);

  function tryRegister() {
    if (password != retypePassword) {
      setMessage("Not valid password or retypePassword");
      return;
    }
    const alreadyUsedEmail = data.find((x) => x.email == email);
    if (alreadyUsedEmail != null) {
      setMessage("This email is already used");
      return;
    }

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
          label="First name"
          variant="outlined"
        />
        <TextField
          onChange={(e) => setLastName(e?.target?.value)}
          label="Last name"
          variant="outlined"
        />
        <TextField
          onChange={(e) => setEmail(e?.target?.value)}
          label="Email"
          variant="outlined"
        />
        <TextField
          onChange={(e) => setPassword(e?.target?.value)}
          label="Password"
          variant="outlined"
          type="password"
        />
        <TextField
          onChange={(e) => setRetypePassword(e?.target?.value)}
          label="Retype Password"
          variant="outlined"
          type="password"
        />

        <Link to="/auth/login">{"Log in"}</Link>
        <div>{message}</div>
        <Button
          variant="contained"
          onClick={tryRegister}
          disabled={notValidButton}
        >
          Register
        </Button>
      </Stack>
    </Box>
  );
};
