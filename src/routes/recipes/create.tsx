import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MutateRecipeForm from "../../forms/MutateRecipe";

const CreateRecipe = () => {
  const navigate = useNavigate();

  return (
    <>
      <Box sx={{ pt: 1 }}>Create recipe</Box>
      <MutateRecipeForm
        onCompletion={() => navigate("/recipes")}
        mode="create"
      />
    </>
  );
};

export default CreateRecipe;
