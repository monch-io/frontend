import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import Search from "../../components/Field/Search";
import IngredientTable from "../../components/IngredientTable";

const Ingredients = () => {
  const [ingredient, setIngredientSearch] = useState("");

  useEffect(() => {
    console.log(ingredient);
  }, []);

  return (
    <>
      <Search text={"Search ingredients"} onChange={setIngredientSearch} />
      <Box sx={{ pt: 1 }}>
        <IngredientTable items={[]} />
      </Box>
    </>
  );
};

export default Ingredients;
