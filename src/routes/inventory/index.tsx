import { Box } from "@mui/material";
import { Pagination } from "monch-backend/build/types/pagination";
import { useState } from "react";
import ErrorBanner from "../../components/ErrorBanner";
import InventoryTable from "../../components/InventoryTable";
import { trpc } from "../../utils/trpc";

const Inventory = () => {
  const [pagination, setPagination] = useState<Pagination>({
    skip: 0,
    take: 50,
  });

  const { data, isLoading, isError, error, refetch } = trpc.useQuery([
    "inventory.getInventoryWithDetails",
    {},
  ]);

  return (
    <Box sx={{ pt: 1 }}>
      {isError ? (
        <ErrorBanner message={error.message} />
      ) : !isLoading ? (
        <InventoryTable
          items={Object.values(data?.entriesByIngredientId || {})}
          pagination={pagination}
          onPaginationChange={setPagination}
          refetch={refetch}
        />
      ) : (
        "loading"
      )}
    </Box>
  );
};

export default Inventory;
