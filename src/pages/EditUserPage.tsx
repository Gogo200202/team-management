import { Box, Button, Stack, TextField } from "@mui/material";
import { useUserContext } from "../components/context/UserContext";
import { Form, useNavigate } from "react-router-dom";
import { DevTool } from "@hookform/devtools";
import {
  useEditUser,
  useGetAllUsers,
  useGetUser,
} from "../api/user.controller";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useState } from "react";

type EditForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  retypePassword: string;
};

export const EditUserPage = () => {
  const { currentUser, handleLogin } = useUserContext();
  const navigate = useNavigate();
  if (currentUser == undefined) {
    navigate("/");
    return;
  }
  const { data: allUsers } = useGetAllUsers();
  const { mutate: editUser } = useEditUser();
  const { data: userFromDB, refetch } = useGetUser(currentUser?.id);
  refetch();
  const [message, setMessage] = useState<string>("");
  const { handleSubmit, control } = useForm<EditForm>({
    defaultValues: {
      email: userFromDB?.email,
      firstName: userFromDB?.firstName,
      lastName: userFromDB?.lastName,
      password: userFromDB?.secretWord,
      retypePassword: userFromDB?.secretWord,
    },
  });
  const onSubmit: SubmitHandler<EditForm> = async ({
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
    const alreadyUsedEmail = allUsers!.find((x) => x.email == email);

    if (
      alreadyUsedEmail != null &&
      userFromDB?.email != alreadyUsedEmail.email
    ) {
      setMessage("This email is already used");
      return;
    }

    editUser({
      id: userFromDB?.id,
      firstName: firstName,
      lastName: lastName,
      createdAt: userFromDB?.createdAt,
      displayName: firstName + " " + lastName,
      email: email,
      secretWord: password,
    });

    handleLogin({
      id: userFromDB.id,
      email: email,
      secretWord: password,
      userName: firstName + " " + lastName,
    });
    refetch();
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

          <Button variant="contained" type="submit">
            Edit
          </Button>
        </Stack>
        <DevTool control={control} /> {/* set up the dev tool */}
      </Form>
    </Box>
  );
};
