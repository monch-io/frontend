import { Box } from "@mui/material";
import { RecipeWithoutIngredients } from "monch-backend/build/types/recipe";
import { useEffect, useState } from "react";
import Search from "../../components/Field/Search";
import RecipeTable from "../../components/RecipeTable";

const items: RecipeWithoutIngredients[] = [
  {
    name: "curry",
    description: "bing",
    id: "123",
    tags: ["spicy"],
  },
];

const Recipes = () => {
  const [recipesSearch, setRecipesSearch] = useState("");

  useEffect(() => {
    console.log(recipesSearch);
  }, []);

  return (
    <>
      <Search text={"Search recipes"} onChange={setRecipesSearch} />
      <Box sx={{ pt: 1 }}>
        <RecipeTable items={items} />
      </Box>
    </>
  );
};

export default Recipes;
