import { Box, TextField, Stack, Button } from "@mui/material";
import { useState } from "react";
import { Form, Link, useNavigate } from "react-router-dom";
import { useCreateUser, useGetAllUsers } from "../api/user.controller";
import { useUserContext } from "../components/context/UserContext";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";

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
  const { mutate } = useCreateUser();

  const [message, setMessage] = useState<string>("");

  const { handleSubmit, control, reset } = useForm<RegisterForm>({
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
    retypePassword,
  }) => {
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
            render={({ field: { onChange, value } }) => (
              <TextField
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
            render={({ field: { onChange, value } }) => (
              <TextField
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
                value={value}
                variant="outlined"
                label="Password"
                onChange={onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="retypePassword"
            render={({ field: { onChange, value } }) => (
              <TextField
                value={value}
                variant="outlined"
                label="Retype password"
                onChange={onChange}
              />
            )}
          />

          <Link to="/auth/login">{"Log in"}</Link>
          <div>{message}</div>
          <Button variant="contained" type="submit">
            Register
          </Button>
        </Stack>
      </Form>
    </Box>
  );
};
