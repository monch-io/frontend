import "./App.css";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Nav from "./components/Nav";

function App() {
  return (
    <Box className="wrapper" sx={{ width: "100%", height: "100%" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          borderBottom: "1px solid grey",
        }}
      >
        Monch.io
      </Box>
      <Box component={"main"} sx={{ display: "flex", flexDirection: "row" }}>
        <Nav />
        <Box sx={{ flex: 1, p: 2 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default App;
