import { Box, Button, Divider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MealTable from "../../components/MealTable";
import Search from "../../components/Search";

const Meals = () => {
  const [mealSearch, setMealSearch] = useState("");

  useEffect(() => {
    console.log(mealSearch);
  }, []);

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
        <Box sx={{ pt: 1 }}>
          <MealTable items={[]} />
        </Box>
      </Box>
    </Box>
  );
};

export default Meals;
