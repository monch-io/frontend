import { Box } from "@mui/material";
import { Pagination } from "monch-backend/build/types/pagination";
import { useState } from "react";
import ErrorBanner from "../../components/ErrorBanner";
import Search from "../../components/Field/Search";
import MealTable from "../../components/MealTable";
import { trpc } from "../../utils/trpc";

const Meals = () => {
  const [_mealSearch, setMealSearch] = useState("");
  const [pagination, setPagination] = useState<Pagination>({
    skip: 0,
    take: 50,
  });

  const { data, isError, error } = trpc.useQuery([
    "meals.search",
    { query: {}, pagination },
  ]);

  return (
    <>
      <Search text={"Search meals"} onChange={setMealSearch} />
      <Box sx={{ pt: 1 }}>
        {isError ? (
          <ErrorBanner message={error.message} />
        ) : (
          <MealTable
            items={data?.items ?? []}
            pagination={pagination}
            onPaginationChange={setPagination}
          />
        )}
      </Box>
    </>
  );
};

export default Meals;
