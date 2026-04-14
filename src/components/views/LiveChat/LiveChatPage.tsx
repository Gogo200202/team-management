import SendIcon from "@mui/icons-material/Send";
import {
  Avatar,
  Box,
  Button,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { Form } from "react-router-dom";
import { io } from "socket.io-client";

import { useUserContext } from "../../context/UserContext";

type Message = {
  message: string;
  userName: string;
};

type ConnectionUser = {
  userName: string;
  id: string;
};

type MessageForm = Omit<Message, "userName">;

const socket = io("http://localhost:8081");
export const LiveChatPage = () => {
  const [receiveMessage, setReceiveMessage] = useState<Message[]>([]);
  const { currentUser, isCheckCompleted } = useUserContext();
  const [snackMessage, setSnackMessage] = useState<string>();
  const [listCurrentUser, setListCurrentUser] = useState<string[]>();

  const { handleSubmit, control } = useForm<MessageForm>();

  useEffect(() => {
    if (isCheckCompleted) {
      socket.emit("JoinedUser", {
        userName: currentUser?.userName,
        id: currentUser?.id,
      } as ConnectionUser);
    }
  }, [isCheckCompleted]);
  const onSubmit: SubmitHandler<MessageForm> = async (data) => {
    const newMessage: Message = {
      message: data.message,
      userName: currentUser!.userName || "",
    };

    socket.emit("Messages", newMessage);
  };
  useEffect(() => {
    socket.on("Messages", (data: Message) => {
      setReceiveMessage([...receiveMessage, data]);
    });

    socket.on("JoinedUser", (data: ConnectionUser) => {
      setSnackMessage(data.userName + " joined");
    });

    socket.on("LeftUser", (data: ConnectionUser) => {
      setSnackMessage(data.userName + " left");
    });

    socket.on("AllUsers", (data: string) => {
      setListCurrentUser(data.split(","));
    });
  }, [receiveMessage]);

  useEffect(() => {
    return () => {
      socket.emit("LeftUser", {
        userName: currentUser?.userName,
        id: currentUser?.id,
      } as ConnectionUser);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const colorUserName = (userName: string) => {
    const coleAvatar =
      "#" +
      (userName.charCodeAt(0) + userName.charCodeAt(1)) +
      (userName.charCodeAt(2) + userName.charCodeAt(3));

    return coleAvatar;
  };
  return (
    <>
      <Box sx={{ mb: 1 }}>
        <Box>
          Current Users:
          <Box sx={{ display: "flex" }}>
            {listCurrentUser?.map((x) => {
              const coleAvatar = colorUserName(x);

              return (
                <Box sx={{ bgcolor: coleAvatar, ml: 1, borderRadius: 1 }}>
                  {x}
                </Box>
              );
            })}
          </Box>
        </Box>
        <Typography>View Receive messages: </Typography>
        {receiveMessage.map((x) => {
          const coleAvatar = colorUserName(x.userName);
          return (
            <Box sx={{ mt: 1, mb: 1, display: "flex" }}>
              <Tooltip title={x.userName}>
                <Avatar
                  sx={{
                    bgcolor: coleAvatar,
                    width: 24,
                    height: 24,
                    fontSize: 15,
                  }}
                  variant="rounded"
                >
                  {x.userName[0]}
                </Avatar>
              </Tooltip>
              : {x.message}
            </Box>
          );
        })}
      </Box>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="message"
          render={({ field: { onChange, value } }) => (
            <Box sx={{ display: "flex", width: "50%" }}>
              <TextField
                value={value}
                label="Message"
                fullWidth
                multiline
                onChange={onChange}
              />
              <Button type="submit" variant="contained" endIcon={<SendIcon />}>
                send
              </Button>
            </Box>
          )}
        />
      </Form>

      <Snackbar
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
        open={!!snackMessage}
        onClose={() => setSnackMessage("")}
        message={snackMessage}
        autoHideDuration={1000}
      />
    </>
  );
};
