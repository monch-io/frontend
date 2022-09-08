import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CreateRecipeForm from "../../forms/CreateRecipe";

const CreateRecipe = () => {
  const navigate = useNavigate();

  return (
    <>
      <Box sx={{ pt: 1 }}>Create recipe</Box>
      <CreateRecipeForm onCompletion={() => navigate("/recipes")} />
    </>
  );
};

export default CreateRecipe;
