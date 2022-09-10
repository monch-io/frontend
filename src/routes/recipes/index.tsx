import { Box } from "@mui/material";
import { Pagination } from "monch-backend/build/types/pagination";
import { useState } from "react";
import ErrorBanner from "../../components/ErrorBanner";
import Search from "../../components/Field/Search";
import RecipeTable from "../../components/RecipeTable";
import { trpc } from "../../utils/trpc";

const Recipes = () => {
  const [recipesSearch, setRecipesSearch] = useState("");
  const [pagination, setPagination] = useState<Pagination>({
    skip: 0,
    take: 50,
  });

  const { data, isError, error } = trpc.useQuery([
    "recipes.search",
    { query: { text: recipesSearch }, pagination },
  ]);

  return (
    <>
      <Search text={"Search recipes"} onChange={setRecipesSearch} />
      <Box sx={{ pt: 1 }}>
        {isError ? (
          <ErrorBanner message={error.message} />
        ) : (
          <RecipeTable
            items={data?.items ?? []}
            pagination={pagination}
            onPaginationChange={setPagination}
          />
        )}
      </Box>
    </>
  );
};

export default Recipes;
