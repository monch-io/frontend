import { DataGrid } from "@mui/x-data-grid";
import { Stack, Typography } from "@mui/material";
import type { QuantifiedIngredient } from "monch-backend/build/types/quantified-ingredient";
import { IngredientLink } from "../IngredientTable";
import type { Unit } from "monch-backend/build/types/unit";

type RecipeTableProps = {
  items: QuantifiedIngredient[];
  pageSize?: number;
};

function formatQuantity(amount: number, unit: Unit): string {
  if (unit !== "piece") {
    return `${amount}${unit}`;
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
              values.row.quantity.value,
              values.row.quantity.unit
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
