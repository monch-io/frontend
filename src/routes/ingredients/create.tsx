import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MutateIngredientForm from "../../forms/MutateIngredient";

const CreateIngredient = () => {
  const navigate = useNavigate();
  return (
    <>
      <Box sx={{ pt: 1 }}>Create ingredient</Box>
      <MutateIngredientForm
        mode="create"
        onCompletion={() => navigate("/ingredients")}
      />
    </>
  );
};

export default CreateIngredient;
