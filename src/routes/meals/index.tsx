import { Box, Button, Divider, Typography } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import Search from "../../components/Search";

const Meals = () => {
  const [mealSearch, setMealSearch] = useState("");

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Typography variant={"h4"}>Meals</Typography>

        <Link
          to="/meals/new"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Button variant="contained">Create</Button>
        </Link>
      </Box>
      <Divider />
      <Box sx={{ pt: 1 }}>
        <Search text={"Search meals"} onChange={setMealSearch} />
        table {mealSearch}
      </Box>
    </Box>
  );
};

export default Meals;
