import { DevTool } from "@hookform/devtools";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { Form, Link, useNavigate } from "react-router-dom";

import { useCreateUser, useGetAllUsers } from "../api/user.controller";
import { useUserContext } from "../components/context/UserContext";
import {
  nameValidate,
  passwordValidation,
  validateRegisterEmail,
} from "./validate/validateForms";

type RegisterForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  retypePassword: string;
};

export const Register = () => {
  const navigate = useNavigate();
  const { handleLogin } = useUserContext();
  const { data = [] } = useGetAllUsers();
  const { mutateAsync } = useCreateUser();

  const {
    handleSubmit,
    control,
    formState: { errors },
    getValues,
  } = useForm<RegisterForm>({
    mode: "all",
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      retypePassword: "",
    },
  });
  const onSubmit: SubmitHandler<RegisterForm> = async ({
    firstName,
    lastName,
    email,
    password,
  }) => {
    const { data: createdUser } = await mutateAsync({
      displayName: firstName + " " + lastName,
      email: email,
      firstName: firstName,
      lastName: lastName,
      createdAt: new Date().toISOString(),
      secretWord: password,
      updatedAt: new Date().toISOString(),
    });

    handleLogin({
      id: createdUser.id,
      email: email,
      secretWord: password,
      userName: firstName + " " + lastName,
    });

    navigate("/");
  };

  return (
    <Box>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Stack
          sx={{ position: "absolute", left: "40%", top: "20%" }}
          spacing={2}
        >
          <Controller
            control={control}
            name="firstName"
            rules={{
              validate: nameValidate,
            }}
            render={({ field: { onChange, value } }) => (
              <TextField
                error={!!errors["firstName"]}
                helperText={errors["firstName"]?.message}
                value={value}
                variant="outlined"
                label="First name"
                onChange={onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="lastName"
            rules={{
              validate: nameValidate,
            }}
            render={({ field: { onChange, value } }) => (
              <TextField
                error={!!errors["lastName"]}
                helperText={errors["lastName"]?.message}
                value={value}
                variant="outlined"
                label="Last name"
                onChange={onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="email"
            rules={{
              validate: (value: string) => {
                return validateRegisterEmail(value, data);
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TextField
                error={!!errors["email"]}
                helperText={errors["email"]?.message}
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
            rules={{ validate: passwordValidation }}
            render={({ field: { onChange, value } }) => (
              <TextField
                error={!!errors["password"]}
                helperText={errors["password"]?.message}
                value={value}
                type="password"
                variant="outlined"
                label="Password"
                onChange={onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="retypePassword"
            rules={{
              validate: (value: string) => {
                if (value != getValues().password) {
                  return "Not valid second password";
                } else {
                  return true;
                }
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TextField
                error={!!errors["retypePassword"]}
                helperText={errors["retypePassword"]?.message}
                type="password"
                value={value}
                variant="outlined"
                label="Retype password"
                onChange={onChange}
              />
            )}
          />

          <Typography
            sx={{
              textDecoration: "none",
              boxShadow: "none",
              textAlign: "center",
            }}
            variant="h7"
            noWrap
            component={Link}
            to="/auth/login"
            color="textPrimary"
            underline="none"
          >
            Log in
          </Typography>

          <Button variant="contained" type="submit">
            Register
          </Button>
        </Stack>
        <DevTool control={control} /> {/* set up the dev tool */}
      </Form>
    </Box>
  );
};
