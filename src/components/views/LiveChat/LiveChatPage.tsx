import SendIcon from "@mui/icons-material/Send";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { Form } from "react-router-dom";
import { io } from "socket.io-client";

type Message = {
  message: string;
};
const socket = io("http://localhost:8081");

export const LiveChatPage = () => {
  const [receiveMessage, setReceiveMessage] = useState<Message[]>([]);

  const { handleSubmit, control } = useForm<Message>();

  const onSubmit: SubmitHandler<Message> = async (data) => {
    socket.emit("Messages", data);
  };
  useEffect(() => {
    socket.on("Messages", (data) => {
      const a: Message = {
        message: data,
      };

      setReceiveMessage([...receiveMessage, a]);
    });

    return () => {
      socket.off("Messages");
    };
  }, [receiveMessage]);

  return (
    <>
      <Box sx={{ mb: 1 }}>
        <Typography>View Receive messages: </Typography>
        {receiveMessage.map((x) => (
          <Box sx={{ mt: 1, mb: 1 }}>{x.message}</Box>
        ))}
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
    </>
  );
};
