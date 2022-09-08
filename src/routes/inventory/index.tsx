import { Box } from "@mui/material";
import { useState } from "react";
import Search from "../../components/Field/Search";
import InventoryTable from "../../components/InventoryTable";

const Inventory = () => {
  const [_inventorySearch, setInventorySearch] = useState("");

  return (
    <>
      <Search text={"Search inventory"} onChange={setInventorySearch} />
      <Box sx={{ pt: 1 }}>
        <InventoryTable items={[]} />
      </Box>
    </>
  );
};

export default Inventory;
