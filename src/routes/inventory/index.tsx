import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import InventoryTable from "../../components/InventoryTable";
import Search from "../../components/Search";

const Inventory = () => {
  const [inventorySearch, setInventorySearch] = useState("");

  useEffect(() => {
    console.log(inventorySearch);
  }, []);

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
