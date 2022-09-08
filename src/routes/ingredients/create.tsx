import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CreateIngredientForm from "../../forms/CreateIngredient";

const CreateIngredient = () => {
  const navigate = useNavigate();
  return (
    <>
      <Box sx={{ pt: 1 }}>Create ingredient</Box>
      <CreateIngredientForm onCompletion={() => navigate("/ingredients")} />
    </>
  );
};

export default CreateIngredient;
