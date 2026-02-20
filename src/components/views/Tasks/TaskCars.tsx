import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import { type FunctionComponent, useEffect, useState } from "react";

import type { Task } from "../../../api/types/taskType";
import type { User } from "../../../api/types/userTypes";
import { useGetUser } from "../../../api/user.controller";

type TaskCardProp = {
  task: Task;
};

const TaskCars: FunctionComponent<TaskCardProp> = ({ task }) => {
  const { data, isFetched } = useGetUser(task.assignedUserId);
  const [user, setUser] = useState<User>();
  useEffect(() => {
    if (isFetched) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(data);
    }
  }, [data, isFetched]);
  return (
    <Box>
      <Card sx={{ maxWidth: 345 }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {task.title}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {task.description}
          </Typography>
        </CardContent>
        <Stack>
          <Box>priority:{task.priority}</Box>
          <Box>status:{task.status}</Box>
          <Box>
            user:{user?.firstName} {user?.lastName}
          </Box>
        </Stack>
      </Card>
    </Box>
  );
};

export default TaskCars;
