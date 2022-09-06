import { Box } from "@mui/material";
import { useParams } from "react-router-dom";

const ViewMeal = () => {
  const { mealId } = useParams();
  return <Box>View Meal - "{mealId}"</Box>;
};

export default ViewMeal;
