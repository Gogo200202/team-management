import { Alert, AlertTitle, Box, Button } from "@mui/material";
import * as React from "react";

import Switch from "@mui/material/Switch";
import Paper from "@mui/material/Paper";
import Fade from "@mui/material/Fade";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useState } from "react";

const icon = (
  <Paper sx={{ m: 1, width: 100, height: 100 }} elevation={4}>
    <svg width="100" height="100">
      <Box
        component="polygon"
        points="0,100 50,00, 100,100"
        sx={(theme) => ({
          fill: theme.palette.common.white,
          stroke: theme.palette.divider,
          strokeWidth: 1,
        })}
      />
    </svg>
  </Paper>
);

export const AlertComponent = () => {
  // the alert is displayed by default
  // const [checked, setChecked] = useState(isVisibility);
  const fadeTime = 300;

  return (
    <Box>
      <Box sx={{ display: "flex" }}>
        <Fade
          //in={checked}
          timeout={{
            enter: fadeTime * 2,
            exit: fadeTime * 2,
          }}
        >
          {
            <Alert severity="success">
              <AlertTitle>Success</AlertTitle>
              This is a success Alert with an encouraging title.
            </Alert>
          }
        </Fade>
      </Box>
    </Box>
  );
};
