import { Box, Button, Divider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import IngredientTable from "../../components/IngredientTable";
import Search from "../../components/Search";

const Ingredients = () => {
  const [ingredient, setIngredientSearch] = useState("");

  useEffect(() => {
    console.log(ingredient);
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
        <Typography variant={"h4"}>Ingredients</Typography>

        <Link
          to="/ingredients/new"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Button variant="contained">Create</Button>
        </Link>
      </Box>
      <Divider />
      <Box sx={{ pt: 1 }}>
        <Search text={"Search ingredients"} onChange={setIngredientSearch} />
        <Box sx={{ pt: 1 }}>
          <IngredientTable items={[]} />
        </Box>
      </Box>
    </Box>
  );
};

export default Ingredients;
