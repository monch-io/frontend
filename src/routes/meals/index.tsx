import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import Search from "../../components/Field/Search";
import MealTable from "../../components/MealTable";

const Meals = () => {
  const [mealSearch, setMealSearch] = useState("");

  useEffect(() => {
    console.log(mealSearch);
  }, []);

  return (
    <>
      <Search text={"Search meals"} onChange={setMealSearch} />
      <Box sx={{ pt: 1 }}>
        <MealTable items={[]} />
      </Box>
    </>
  );
};

export default Meals;
