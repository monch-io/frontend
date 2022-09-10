import { Box, Typography } from "@mui/material";
import { Navigate, useParams } from "react-router-dom";
import ErrorBanner from "../../components/ErrorBanner";
import MutateRecipeForm from "../../forms/MutateRecipe";
import { trpc } from "../../utils/trpc";

const ViewRecipe = () => {
  const { recipeId } = useParams();

  if (typeof recipeId === "undefined") {
    return <Navigate replace to="/not-found" />;
  }

  const { data, isError, error } = trpc.useQuery([
    "recipes.findById",
    { id: recipeId },
  ]);

  return (
    <Box>
      {isError ? (
        <ErrorBanner message={error.message} />
      ) : typeof data !== "undefined" && data ? (
        <Box>
          <Typography variant={"body1"}>Editing "{data.name}"</Typography>
          <MutateRecipeForm mode="update" value={data} />
        </Box>
      ) : (
        <Box>loading</Box>
      )}
    </Box>
  );
};

export default ViewRecipe;
