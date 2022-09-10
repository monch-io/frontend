import { Box, Typography } from "@mui/material";
import { Navigate, useParams } from "react-router-dom";
import ErrorBanner from "../../components/ErrorBanner";
import MutateIngredientForm from "../../forms/MutateIngredient";
import { trpc } from "../../utils/trpc";

const ViewIngredient = () => {
  const { ingredientId } = useParams();

  if (typeof ingredientId === "undefined") {
    return <Navigate replace to="/not-found" />;
  }

  const { data, isError, error } = trpc.useQuery([
    "ingredients.findById",
    { id: ingredientId },
  ]);

  return (
    <Box>
      {isError ? (
        <ErrorBanner message={error.message} />
      ) : typeof data !== "undefined" && data ? (
        <Box>
          <Typography variant={"body1"}>
            Editing ingredient "{data.name}"
          </Typography>
          <MutateIngredientForm mode="update" value={data} />
        </Box>
      ) : (
        <Box>loading</Box>
      )}
    </Box>
  );
};

export default ViewIngredient;
