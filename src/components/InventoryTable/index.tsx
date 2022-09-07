import { DataGrid } from "@mui/x-data-grid";
import { Stack, Typography } from "@mui/material";
import type { QuantifiedIngredient } from "monch-backend/src/types/quantified-ingredient";
import { z } from "zod";
import { IngredientLink } from "../IngredientTable";
import { QuantityType } from "monch-backend/src/types/quantity-type";

// @@Temp: Backend needs to export `QuantifiedIngredient` interface
interface QuantifiedIngredient extends z.infer<typeof QuantifiedIngredient> {}

type RecipeTableProps = {
  items: QuantifiedIngredient[];
  pageSize?: number;
};

function formatQuantity(amount: number, quantityType: QuantityType): string {
  if (quantityType === "continuous") {
    return `${amount}`;
  } else {
    return `${amount}`;
  }
}

const InventoryTable = ({ items, pageSize = 20 }: RecipeTableProps) => {
  return (
    <DataGrid
      autoHeight
      columns={[
        {
          field: "name",
          headerName: "Name",
          renderCell: (values) => {
            return (
              <IngredientLink
                name={values.row.ingredient.name}
                id={values.row.ingredient.id}
              />
            );
          },
          width: 400,
        },
        {
          field: "amount",
          headerName: "Amount",
          renderCell: (values) => {
            return formatQuantity(
              values.row.quantity,
              values.row.ingredient.quantityType
            );
          },
          width: 200,
        },
      ]}
      rowsPerPageOptions={[pageSize]}
      pageSize={pageSize}
      rows={items}
      components={{
        NoRowsOverlay: () => (
          <Stack height="100%" alignItems="center" justifyContent="center">
            <Typography>No items yet</Typography>
          </Stack>
        ),
      }}
    />
  );
};

export default InventoryTable;
