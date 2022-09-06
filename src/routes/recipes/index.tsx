import { Box, Button, Divider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RecipeTable from "../../components/RecipeTable";
import Search from "../../components/Search";

const Recipes = () => {
  const [recipesSearch, setRecipesSearch] = useState("");

  useEffect(() => {
    console.log(recipesSearch);
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
        <Typography variant={"h4"}>Recipes</Typography>

        <Link
          to="/recipes/new"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Button variant="contained">Create</Button>
        </Link>
      </Box>
      <Divider />
      <Box sx={{ pt: 1 }}>
        <Search text={"Search recipes"} onChange={setRecipesSearch} />
        <Box sx={{ pt: 1 }}>
          <RecipeTable items={[]} />
        </Box>
      </Box>
    </Box>
  );
};

export default Recipes;
