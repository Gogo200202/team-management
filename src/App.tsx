import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./pages/routes";
import { ThemeProvider } from "@emotion/react";
import { createTheme, CssBaseline } from "@mui/material";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./config/queryClient.config";
import { UserProvider } from "./components/context/UserContext";

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
    </QueryClientProvider>
  );
}

export default App;
