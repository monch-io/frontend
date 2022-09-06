import "./App.css";
import { Outlet } from "react-router-dom";
import { Box, Divider } from "@mui/material";
import Nav from "./components/Nav";
import { QueryClient, QueryClientProvider } from "react-query";
import { trpc } from "./utils/trpc";
import { useState } from "react";

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      url: process.env["REACT_APP_API_ENDPOINT"] as string,
    })
  );

  return (
    <Box className="wrapper" sx={{ width: "100%", height: "100%" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          pb: 2,
          pt: 2,
          m: 1,
        }}
      >
        Monch.io
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
  );
}

export default App;
