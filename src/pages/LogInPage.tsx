import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { Form, Link, useNavigate } from "react-router-dom";

import type { User } from "../api/types/userTypes";
import { useGetAllUsers } from "../api/user.controller";
import { useUserContext } from "../components/context/UserContext";
import { emailValidation, passwordValidation } from "./validate/validateForms";
type LogInForm = {
  email: string;
  password: string;
};

export const LogInPage = () => {
  const { data = [] } = useGetAllUsers();
  const { handleLogin } = useUserContext();
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LogInForm>({
    mode: "all",
    defaultValues: { email: "", password: "" },
  });

  const onSubmit: SubmitHandler<LogInForm> = async ({ email, password }) => {
    const user = data.find((x: User) => x.email == email);

    if (typeof user === "undefined") {
      return;
    }

    if (user.secretWord == password) {
      handleLogin({
        id: user.id,
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
            rules={{
              validate: emailValidation,
            }}
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <TextField
                value={value}
                variant="outlined"
                label="Email"
                onChange={onChange}
                error={!!errors["email"]}
                helperText={errors["email"]?.message}
              />
            )}
          />

          <Controller
            rules={{
              validate: passwordValidation,
            }}
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <TextField
                type="password"
                value={value}
                variant="outlined"
                label="Password"
                onChange={onChange}
                error={!!errors["password"]}
                helperText={errors["password"]?.message}
              />
            )}
          />
          <Box
            sx={{
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                textDecoration: "none",
                boxShadow: "none",
                textAlign: "center",
              }}
              noWrap
              component={Link}
              to="/auth/register"
              color="textPrimary"
            >
              Register
            </Typography>
          </Box>

          <Button variant="contained" type="submit">
            Log in
          </Button>
        </Stack>
      </Form>
    </Box>
  );
};
