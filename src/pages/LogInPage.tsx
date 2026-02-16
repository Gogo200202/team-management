import { Box, TextField, Stack, Button } from "@mui/material";
import { useState } from "react";
import { Form, Link, useNavigate } from "react-router-dom";
import { useGetAllUsers } from "../api/user.controller";
import type { User } from "../api/userTypes";
import { useUserContext } from "../components/context/UserContext";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";

type LogInForm = {
  email: string;
  password: string;
};

export const LogInPage = () => {
  const { data = [] } = useGetAllUsers();
  const { handleLogin } = useUserContext();
  const navigate = useNavigate();
  const [message, setMessage] = useState(false);

  const { handleSubmit, control } = useForm<LogInForm>({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit: SubmitHandler<LogInForm> = async ({ email, password }) => {
    const user = data.find((x: User) => x.email == email);

    if (typeof user === "undefined") {
      setMessage(true);
      return;
    }

    if (user.secretWord == password) {
      handleLogin({
        email: user.email,
        secretWord: user.secretWord,
        userName: user.displayName,
      });
      navigate("/");
    }
  };

  return (
    <Box>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Stack
          sx={{ position: "absolute", left: "40%", top: "30%" }}
          spacing={2}
        >
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <TextField
                value={value}
                variant="outlined"
                label="Email"
                onChange={onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <TextField
                type="password"
                value={value}
                variant="outlined"
                label="Password"
                onChange={onChange}
              />
            )}
          />
          <Link to="/auth/register">Register</Link>
          <Button variant="contained" type="submit">
            Log in
          </Button>
          {message ? <div>not valid email or password</div> : <div></div>}
        </Stack>
      </Form>
    </Box>
  );
};
