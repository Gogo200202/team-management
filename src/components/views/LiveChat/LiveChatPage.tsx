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
type MessageForm = Omit<Message, "userName">;

const socket = io("http://localhost:8081");
export const LiveChatPage = () => {
  const [receiveMessage, setReceiveMessage] = useState<Message[]>([]);
  const { currentUser, isCheckCompleted } = useUserContext();
  const [snackMessage, setSnackMessage] = useState<string>();

  const { handleSubmit, control } = useForm<MessageForm>();

  useEffect(() => {
    if (isCheckCompleted) {
      socket.emit("JoinedUser", { userName: currentUser?.userName });
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

    socket.on("JoinedUser", (data) => {
      setSnackMessage(data.userName + " joined");
    });

    socket.on("LeftUser", (data) => {
      setSnackMessage(data.userName + " left");
    });
  }, [receiveMessage]);

  useEffect(() => {
    return () => {
      socket.emit("LeftUser", { userName: currentUser?.userName });
    };
  }, []);

  return (
    <>
      <Box sx={{ mb: 1 }}>
        <Typography>View Receive messages: </Typography>
        {receiveMessage.map((x) => {
          const coleAvatar =
            "#" +
            (x.userName.charCodeAt(0) + x.userName.charCodeAt(1)) +
            (x.userName.charCodeAt(2) + x.userName.charCodeAt(3));
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
            <TextField
              value={value}
              label="Message"
              fullWidth
              onChange={onChange}
            />
          )}
        />
        <Button
          type="submit"
          sx={{ mt: 1 }}
          variant="contained"
          endIcon={<SendIcon />}
        >
          send
        </Button>
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
