import { Box } from "@mui/material";
import CreateRecipeForm from "../../forms/CreateRecipe";

const CreateRecipe = () => {
  return (
    <>
      <Box sx={{ pt: 1 }}>Create recipe</Box>
      <CreateRecipeForm onCompletion={() => console.log("done")} />
    </>
  );
};

export default CreateRecipe;
