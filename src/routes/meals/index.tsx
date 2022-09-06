import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import MealTable from "../../components/MealTable";
import Search from "../../components/Search";

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
