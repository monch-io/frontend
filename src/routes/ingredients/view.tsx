import { Box } from "@mui/material";
import { useParams } from "react-router-dom";

const ViewIngredient = () => {
  const { ingredientId } = useParams();
  return <Box>View Ingredient {ingredientId}</Box>;
};

export default ViewIngredient;
