import "./App.css";

import { ThemeProvider } from "@emotion/react";
import { createTheme, CssBaseline } from "@mui/material";
import { QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { queryClient } from "./config/queryClient.config";
import { UserProvider } from "./components/context/UserContext";
import { routes } from "./pages/routes";

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
const router = createBrowserRouter(routes);

function App() {
  const theme = createTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RouterProvider router={router} />
        </ThemeProvider>
      </UserProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
