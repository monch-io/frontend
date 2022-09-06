import "./App.css";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

function App() {
  return (
    <Box className="wrapper" sx={{ width: "100%", height: "100%" }}>
      <Box
        sx={{ display: "flex", flexDirection: "row", p: 2, gridArea: "header" }}
      >
        Monch.io
      </Box>
      <Box component={"main"} sx={{ display: "flex", flexDirection: "row" }}>
        <Box sx={{ p: 1 }}>Nav</Box>
        <Box sx={{ flex: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default App;
