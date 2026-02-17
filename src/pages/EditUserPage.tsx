import {
  Box,
  Button,
  Snackbar,
  Stack,
  TextField,
  type SnackbarCloseReason,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { Form } from "react-router-dom";

import {
  useEditUser,
  useGetAllUsers,
  useGetUser,
} from "../api/user.controller";
import { useUserContext } from "../components/context/UserContext";
import {
  nameValidate,
  passwordValidation,
  validateEditEmail,
} from "./validate/validateForms";
import { SnackbarComponent } from "../components/common/SnackbarComponent";

type EditForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  retypePassword: string;
};

export const EditUserPage = () => {
  const { currentUser, handleLogin } = useUserContext();
  const { data: allUsers } = useGetAllUsers();
  const { mutate: editUser } = useEditUser();
  const { data: userFromDB, isLoading } = useGetUser(currentUser!.id!);

  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (reason?: SnackbarCloseReason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const {
    handleSubmit,
    control,
    getValues,
    reset,
    formState: { errors },
  } = useForm<EditForm>({
    mode: "all",
  });

  useEffect(() => {
    if (!isLoading) {
      reset({
        email: userFromDB?.email,
        firstName: userFromDB?.firstName,
        lastName: userFromDB?.lastName,
        password: userFromDB?.secretWord,
        retypePassword: userFromDB?.secretWord,
      });
    }
  }, [isLoading, reset]);

  const onSubmit: SubmitHandler<EditForm> = async ({
    firstName,
    lastName,
    email,
    password,
    retypePassword,
  }) => {
    if (password != retypePassword) {
      return;
    }
    const alreadyUsedEmail = allUsers!.find((x) => x.email == email);

    if (
      alreadyUsedEmail != null &&
      userFromDB?.email != alreadyUsedEmail.email
    ) {
      return;
    }

    editUser({
      id: userFromDB!.id,
      firstName: firstName,
      lastName: lastName,
      email: email,
      secretWord: password,
    });

    handleLogin({
      id: userFromDB!.id!,
      email: email,
      secretWord: password,
      userName: firstName + " " + lastName,
    });
    handleClick();
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
            rules={{ validate: nameValidate }}
            render={({ field: { onChange, value } }) => (
              <TextField
                value={value}
                variant="outlined"
                label="First name"
                onChange={onChange}
                error={!!errors["firstName"]}
                helperText={errors["firstName"]?.message}
              />
            )}
          />
          <Controller
            control={control}
            rules={{ validate: nameValidate }}
            name="lastName"
            render={({ field: { onChange, value } }) => (
              <TextField
                value={value}
                variant="outlined"
                label="Last name"
                onChange={onChange}
                error={!!errors["lastName"]}
                helperText={errors["lastName"]?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="email"
            rules={{
              validate: (value: string) => {
                return validateEditEmail(
                  value,
                  currentUser!.email,
                  allUsers || [],
                );
              },
            }}
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
            control={control}
            name="password"
            rules={{ validate: passwordValidation }}
            render={({ field: { onChange, value } }) => (
              <TextField
                value={value}
                type="password"
                variant="outlined"
                label="Password"
                onChange={onChange}
                error={!!errors["password"]}
                helperText={errors["password"]?.message}
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
                value={value}
                type="password"
                variant="outlined"
                label="Retype password"
                onChange={onChange}
                error={!!errors["retypePassword"]}
                helperText={errors["retypePassword"]?.message}
              />
            )}
          />

          <Button variant="contained" type="submit">
            Edit
          </Button>
        </Stack>
      </Form>
      <div>
        <Button onClick={handleClick}>Open Snackbar</Button>
        <Snackbar
          open={open}
          autoHideDuration={1500}
          onClose={handleClose}
          message="You edit it"
        />
      </div>
    </Box>
  );
};
