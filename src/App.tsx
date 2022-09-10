import "./App.css";
import { Outlet } from "react-router-dom";
import { Box, Divider, Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import Nav from "./components/Nav";
import { QueryCache, QueryClient, QueryClientProvider } from "react-query";
import { trpc } from "./utils/trpc";
import { useState } from "react";
import Theme from "./theme";

// API querying client.
const queryCache = new QueryCache();
const queryClient = new QueryClient({
  queryCache,
  defaultOptions: {
    queries: {
      retry: 0,
      enabled: true,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const [trpcClient] = useState(() =>
    trpc.createClient({
      url: process.env["REACT_APP_API_ENDPOINT"] as string,
    })
  );

  return (
    <ThemeProvider theme={Theme}>
      <Box className="wrapper" sx={{ width: "100%", height: "100%" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            p: 2,
          }}
        >
          <Typography variant={"h5"}>Monch.io</Typography>
        </Box>
        <Divider />
        <Box
          component={"main"}
          sx={{ display: "flex", flexDirection: "row", height: "100%" }}
        >
          <Nav />
          <Divider orientation="vertical" flexItem />
          <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
              <Box sx={{ flex: 1, p: 2 }}>
                <Outlet />
              </Box>
            </QueryClientProvider>
          </trpc.Provider>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
