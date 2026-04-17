import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SendIcon from "@mui/icons-material/Send";
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  InputAdornment,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { Form } from "react-router-dom";
import { io } from "socket.io-client";

import { type UserStored, useUserContext } from "../../context/UserContext";

type MessageSend = {
  user: UserStored;

  message: string;
};

type newMessageResave = {
  id: string;
  createdDate: string;
} & MessageSend;

type ConnectionUser = {
  userName: string;
  id: string;
};

type MessageResave = {
  id?: string;
  user: UserStored;
  text: string;
  createdDate: string;
  room?: string;
};

type MessageForm = Omit<MessageSend, "userName">;

const socket = io("http://localhost:8081");
export const LiveChatPage = () => {
  const [receiveMessage, setReceiveMessage] = useState<MessageResave[]>([]);
  const { currentUser, isCheckCompleted } = useUserContext();
  const [snackMessage, setSnackMessage] = useState<string>();
  const [listCurrentUser, setListCurrentUser] = useState<string[]>();
  const messagesEndRef = useRef<Element>(null);
  const { reset, handleSubmit, control } = useForm<MessageForm>();

  useEffect(() => {
    if (isCheckCompleted) {
      const message: ConnectionUser = {
        userName: currentUser!.userName,
        id: currentUser!.id,
      };
      socket.emit("JoinedUser", message, (data: MessageResave[]) => {
        setReceiveMessage(data);
      });
    }
  }, [isCheckCompleted]);
  const onSubmit: SubmitHandler<MessageForm> = async (data) => {
    const newMessage: MessageSend = {
      message: data.message,
      user: currentUser!,
    };

    socket.emit("Messages", newMessage);
    reset({ message: "" });
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView();
    }
    socket.on("Messages", (data: newMessageResave) => {
      const newData: MessageResave = { ...data, text: data.message };

      setReceiveMessage([...receiveMessage, newData]);
    });
    socket.on("ModifyMessage", (data) => {
      const newNotDeletedMessages = receiveMessage.filter(
        (x) => x.id != data.id,
      );
      setReceiveMessage([...newNotDeletedMessages]);
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

  const handelDeleteMessage = (id: string | undefined) => {
    socket.emit("ModifyMessage", { id: id, typeMod: "Delete" });
  };

  const handelEdit=()=>{
    
  }
  const colorUserName = (userName: string) => {
    const coleAvatar =
      "#" +
      (userName.charCodeAt(0) + userName.charCodeAt(1)) +
      (userName.charCodeAt(2) + userName.charCodeAt(3));

    return coleAvatar;
  };
  return (
    <>
      <Box>
        <Box sx={{ ml: "20%", mr: "30%" }}>
          <Box sx={{ mb: 10 }}>
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
            {receiveMessage.map((x, index) => {
              const coleAvatar = colorUserName(x.user.userName);
              let showTime: boolean =
                x.user.id != receiveMessage[index + 1]?.user.id;

              if (receiveMessage[index + 1] == undefined) {
                showTime = false;
              }

              return (
                <Box sx={{ mt: 1, mb: 1 }} ref={messagesEndRef}>
                  {currentUser?.id == x.user.id ? (
                    <Box sx={{ display: "flex" }}>
                      <Tooltip title={x.user.userName}>
                        <Avatar
                          sx={{
                            bgcolor: coleAvatar,
                            width: 24,
                            height: 24,
                            fontSize: 15,
                            mr: 1,
                          }}
                          variant="rounded"
                        >
                          {x.user.userName[0]}
                        </Avatar>
                      </Tooltip>
                      :
                      <Tooltip
                        placement="bottom-start"
                        slotProps={{
                          popper: {
                            modifiers: [
                              {
                                name: "offset",
                                options: {
                                  offset: [0, -14],
                                },
                              },
                            ],
                          },
                        }}
                        title={
                          <Stack spacing={1}>
                            <Box sx={{ textAlign: "center", fontSize: 15 }}>
                              settings
                            </Box>
                            <Box sx={{ display: "flex" }}>
                              <Chip
                                color="error"
                                onClick={() => handelDeleteMessage(x.id)}
                                icon={<DeleteIcon />}
                                label="Delete"
                              />

                              <Chip
                                color="info"
                                onClick={() => handelEdit(x.id)}
                                icon={<EditIcon />}
                                label="Edit"
                              />
                            </Box>
                          </Stack>
                        }
                      >
                        <Box sx={{ width: "90%" }}>
                          <Typography sx={{ wordWrap: "break-word" }}>
                            {x.text}
                          </Typography>
                        </Box>
                      </Tooltip>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        right: 0,
                      }}
                    >
                      <Typography>{x.text}</Typography>:
                      <Tooltip title={x.user.userName}>
                        <Avatar
                          sx={{
                            bgcolor: coleAvatar,
                            width: 24,
                            height: 24,
                            fontSize: 15,
                            ml: 1,
                          }}
                          variant="rounded"
                        >
                          {x.user.userName[0]}
                        </Avatar>
                      </Tooltip>
                    </Box>
                  )}
                  {showTime && (
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      {dayjs(x.createdDate).format("YYYY/MM/DD/H:MM")}
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>

          <Box sx={{ position: "fixed", bottom: 20, width: "40%" }}>
            <Box ref={messagesEndRef}></Box>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                control={control}
                name="message"
                render={({ field: { onChange, value } }) => (
                  <Box sx={{ display: "flex", width: 1 }}>
                    <TextField
                      sx={{ bgcolor: "#fff" }}
                      value={value}
                      required={true}
                      label="Message"
                      fullWidth
                      onChange={onChange}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton color="info" type="submit">
                                <SendIcon />
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Box>
                )}
              />
            </Form>
          </Box>
        </Box>

        <Snackbar
          anchorOrigin={{ horizontal: "right", vertical: "top" }}
          open={!!snackMessage}
          onClose={() => setSnackMessage("")}
          message={snackMessage}
          autoHideDuration={1000}
        />
      </Box>
    </>
  );
};
