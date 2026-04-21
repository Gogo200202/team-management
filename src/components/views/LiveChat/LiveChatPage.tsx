import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SendIcon from "@mui/icons-material/Send";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import {
  Avatar,
  AvatarGroup,
  Box,
  Chip,
  IconButton,
  InputAdornment,
  Paper,
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

type ModifyMessage = MessageResave & {
  typeMod: "Edit" | "Delete";
};

const colorLetters = "grey.500";
const colorLettersAvatars = "grey.400";
type MessageForm = Omit<MessageSend, "userName">;

const socket = io("http://localhost:8081");
export const LiveChatPage = () => {
  const [receiveMessage, setReceiveMessage] = useState<MessageResave[]>([]);
  const { currentUser, isCheckCompleted } = useUserContext();
  const [snackMessage, setSnackMessage] = useState<string>();
  const [listCurrentUser, setListCurrentUser] = useState<string[]>([
    "teas asd",
    "asdasd asd",
  ]);
  const messagesEndRef = useRef<Element>(null);
  const [editMessage, setEditMessage] = useState<MessageResave | null>(null);
  const { reset, handleSubmit, control, setValue } = useForm<MessageForm>();

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

    if (!editMessage) {
      socket.emit("Messages", newMessage);
    } else {
      const newEditMessage: ModifyMessage = {
        text: data.message,
        user: currentUser!,
        createdDate: editMessage.createdDate,
        typeMod: "Edit",
        id: editMessage.id,
        room: "mainChat",
      };

      socket.emit("ModifyMessage", { ...newEditMessage, typeMod: "Edit" });
      setEditMessage(null);
    }
    reset({ message: "" });
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      //   console.log(messagesEndRef.current);
      messagesEndRef.current.scrollIntoView();
    }
    socket.on("Messages", (data: newMessageResave) => {
      const newData: MessageResave = { ...data, text: data.message };

      setReceiveMessage([...receiveMessage, newData]);
    });
    socket.on("ModifyMessage", (data: ModifyMessage) => {
      if (data.typeMod === "Edit") {
        const newNotDeletedMessages: MessageResave[] = receiveMessage.map(
          (x) => {
            if (x.id == data.id) {
              return data as MessageResave;
            }

            return x as MessageResave;
          },
        );

        setReceiveMessage([...newNotDeletedMessages]);
      } else if (data.typeMod === "Delete") {
        const newNotDeletedMessages = receiveMessage.filter(
          (x) => x.id != data.id,
        );

        setReceiveMessage([...newNotDeletedMessages]);
      }
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

  const handelEdit = (message: MessageResave) => {
    setEditMessage(message);
    setValue("message", message.text);
  };
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
        <Box sx={{ position: "fixed", top: "2/3", right: "10%" }}>
          <Box sx={{ mb: 10 }}>
            <Typography>Messages: {receiveMessage[0]?.room}</Typography>
          </Box>
          <Stack>
            <Typography sx={{ textAlign: "right" }}>Current Users</Typography>
            <AvatarGroup spacing={15}>
              {listCurrentUser?.map((x) => (
                <Tooltip title={x}>
                  <Avatar
                    sx={{
                      width: 35,
                      height: 35,
                      bgcolor: colorUserName(x),
                    }}
                  >
                    {x[0]}
                  </Avatar>
                </Tooltip>
              ))}
            </AvatarGroup>
            {/* <Stack sx={{ mt: 1 }} spacing={1}></Stack> */}
          </Stack>
        </Box>
        <Box sx={{ ml: "20%", mr: "30%" }}>
          <Box sx={{ mb: 10 }}>
            {receiveMessage.map((x, index) => {
              const coleAvatar = colorUserName(x.user.userName);

              const date1 = dayjs(x.createdDate);
              const date2 = dayjs(receiveMessage[++index]?.createdDate);

              const showTime = !date2.isSame(date1, "day");

              const isItEditing: boolean = editMessage?.id == x.id;

              return (
                <Box sx={{ mt: 2, mb: 2 }} ref={messagesEndRef}>
                  {currentUser?.id == x.user.id ? (
                    <Box sx={{ display: "flex", position: "relative" }}>
                      <Box sx={{ mt: 1, mr: 1, display: "flex" }}>
                        {isItEditing && <SubdirectoryArrowRightIcon />}
                        <Avatar
                          sx={{
                            bgcolor: coleAvatar,
                            color: colorLettersAvatars,
                            fontSize: 15,
                            fontWeight: "bold",
                          }}
                        >
                          {x.user.userName
                            .split(" ")
                            .map((x) => x[0])
                            .join(" ")}
                        </Avatar>
                      </Box>
                      <Box
                        sx={{
                          mt: 1.5,
                          width: 0,
                          height: 0,
                          borderTop: "10px solid transparent",
                          borderBottom: "10px solid transparent",

                          borderRight: "10px solid grey",
                          //bgcolor: coleAvatar,
                        }}
                      />
                      <Box
                        sx={{
                          ...(x.text.length > 60 && { width: "80%" }),
                        }}
                      >
                        <Paper
                          sx={{
                            borderRadius: 3,
                            border: 1,

                            borderColor: colorLetters,
                          }}
                          elevation={12}
                        >
                          <Box sx={{ pl: 1, pr: 1 }}>
                            <Box
                              sx={{
                                fontSize: 13,
                                display: "flex",
                              }}
                            >
                              You :
                              <Box
                                sx={{
                                  color: colorLetters,
                                  fontSize: 10,
                                  mt: 0.3,
                                  ml: 0.5,
                                }}
                              >
                                ({x.user.userName})
                              </Box>
                            </Box>
                            <Typography
                              sx={{
                                wordWrap: "break-word",
                              }}
                            >
                              {x.text}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "end",
                                color: colorLetters,
                              }}
                            >
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
                                    <Box
                                      sx={{
                                        textAlign: "center",
                                        fontSize: 15,
                                      }}
                                    >
                                      settings
                                    </Box>
                                    <Box sx={{ display: "flex" }}>
                                      <Chip
                                        color="error"
                                        onClick={() =>
                                          handelDeleteMessage(x.id)
                                        }
                                        icon={<DeleteIcon />}
                                        label="Delete"
                                      />

                                      <Chip
                                        color="info"
                                        onClick={() => handelEdit(x)}
                                        icon={<EditIcon />}
                                        label="Edit"
                                      />
                                    </Box>
                                  </Stack>
                                }
                              >
                                <MoreHorizIcon />
                              </Tooltip>
                              <Box sx={{ ml: 1 }}>
                                {dayjs(x.createdDate).format("H:mm")}
                              </Box>
                            </Box>
                          </Box>
                        </Paper>
                      </Box>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        right: 0,
                      }}
                    >
                      <Box
                        sx={{
                          ...(x.text.length > 60 && { width: "80%" }),
                        }}
                      >
                        <Paper
                          sx={{
                            borderRadius: 3,
                            border: 1,
                            borderColor: colorLetters,
                          }}
                          elevation={12}
                        >
                          <Box sx={{ pl: 1, pr: 1 }}>
                            <Box sx={{ color: colorLetters, fontSize: 13 }}>
                              {x.user.userName}
                            </Box>

                            <Typography
                              sx={{
                                wordWrap: "break-word",
                              }}
                            >
                              {x.text}
                            </Typography>
                            <Box
                              sx={{
                                fontSize: 13,
                                color: colorLetters,
                              }}
                            >
                              {dayjs(x.createdDate).format("H:mm")}
                            </Box>
                          </Box>
                        </Paper>
                      </Box>

                      <Avatar
                        sx={{
                          bgcolor: coleAvatar,
                          fontSize: 15,
                          color: colorLettersAvatars,
                          ml: 1,
                          fontWeight: "bold",
                          mt: 1,
                        }}
                      >
                        {x.user.userName
                          .split(" ")
                          .map((x) => x[0])
                          .join(" ")}
                      </Avatar>
                    </Box>
                  )}
                  {showTime && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        mt: 1,
                        mb: 1,
                      }}
                    >
                      {dayjs(receiveMessage[index + 1]?.createdDate).format(
                        "YYYY/MM/DD",
                      )}
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>

          <Box sx={{ position: "fixed", bottom: 20, width: "40%" }}>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                control={control}
                name="message"
                render={({ field: { onChange, value } }) => {
                  return (
                    <Box sx={{ display: "flex", width: 1 }}>
                      <TextField
                        sx={{ bgcolor: "#fff" }}
                        value={value}
                        required={true}
                        label="Message"
                        fullWidth
                        onChange={onChange}
                        slotProps={{
                          inputLabel: { shrink: !!value },
                          input: {
                            endAdornment: (
                              <InputAdornment position="end">
                                <>
                                  {!!editMessage && (
                                    <IconButton
                                      onClick={() => {
                                        reset({ message: "" });
                                        setEditMessage(null);
                                      }}
                                    >
                                      <ClearIcon color="warning" />
                                    </IconButton>
                                  )}

                                  <IconButton
                                    color={editMessage ? "success" : "info"}
                                    sx={{
                                      bgcolor: colorLettersAvatars,
                                      borderRadius: 1,
                                    }}
                                    type="submit"
                                  >
                                    <SendIcon />
                                  </IconButton>
                                </>
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    </Box>
                  );
                }}
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
      <Box ref={messagesEndRef}></Box>
    </>
  );
};
