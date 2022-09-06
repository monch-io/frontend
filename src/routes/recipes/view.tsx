import { Box } from "@mui/material";
import { useParams } from "react-router-dom";

const ViewRecipe = () => {
  const { recipeId } = useParams();
  return <Box>View Recipe - "{recipeId}" </Box>;
};

export default ViewRecipe;
