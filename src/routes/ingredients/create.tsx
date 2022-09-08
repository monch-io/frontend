import { Box } from "@mui/material";
import CreateIngredientForm from "../../forms/CreateIngredient";

const CreateIngredient = () => {
  return (
    <>
      <Box sx={{ pt: 1 }}>Create ingredient</Box>
      <CreateIngredientForm onCompletion={() => console.log("done")} />
    </>
  );
};

export default CreateIngredient;
