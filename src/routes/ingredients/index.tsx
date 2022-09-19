import { Box } from "@mui/material";
import { Pagination } from "monch-backend/build/types/pagination";
import { useState } from "react";
import ErrorBanner from "../../components/ErrorBanner";
import Search from "../../components/Field/Search";
import IngredientTable from "../../components/IngredientTable";
import { trpc } from "../../utils/trpc";

const Ingredients = () => {
  const [ingredient, setIngredientSearch] = useState("");
  const [pagination, setPagination] = useState<Pagination>({
    skip: 0,
    take: 50,
  });

  const { data, isLoading, refetch, isError, error } = trpc.useQuery([
    "ingredients.search",
    { query: { text: ingredient }, pagination },
  ]);

  return (
    <>
      <Search text={"Search ingredients"} onChange={setIngredientSearch} />
      <Box sx={{ pt: 1 }}>
        {isError ? (
          <ErrorBanner message={error.message} />
        ) : (
          <IngredientTable
            items={data?.items ?? []}
            loading={isLoading}
            refetch={refetch}
            pagination={pagination}
            onPaginationChange={setPagination}
          />
        )}
      </Box>
    </>
  );
};

export default Ingredients;
