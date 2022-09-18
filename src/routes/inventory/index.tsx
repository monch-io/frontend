import { Box } from "@mui/material";
import { Pagination } from "monch-backend/build/types/pagination";
import { useState } from "react";
import ErrorBanner from "../../components/ErrorBanner";
import Search from "../../components/Field/Search";
import InventoryTable from "../../components/InventoryTable";
import { trpc } from "../../utils/trpc";

const Inventory = () => {
  const [inventorySearch, setInventorySearch] = useState("");
  const [pagination, setPagination] = useState<Pagination>({
    skip: 0,
    take: 50,
  });

  const { data, isLoading, isError, error } = trpc.useQuery([
    "inventory.getInventory",
    { query: { text: inventorySearch }, pagination },
  ]);

  return (
    <>
      <Search text={"Search inventory"} onChange={setInventorySearch} />
      <Box sx={{ pt: 1 }}>
        {isError ? (
          <ErrorBanner message={error.message} />
        ) : !isLoading ? (
          <InventoryTable
            items={Object.values(data?.entriesByIngredientId || {})}
            pagination={pagination}
            onPaginationChange={setPagination}
          />
        ) : (
          "loading"
        )}
      </Box>
    </>
  );
};

export default Inventory;
