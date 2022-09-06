import { Stack, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { Ingredient } from "monch-backend/src/types/ingredient";

type IngredientTableProps = {
  items: Ingredient[];
  pageSize?: number;
};

const IngredientTable = ({ items, pageSize = 20 }: IngredientTableProps) => {
  return (
    <DataGrid
      autoHeight
      columns={[
        {
          field: "name",
          headerName: "Name",
          valueGetter: (values) => {
            return values.row.name;
          },
          width: 200,
        },
        {
          field: "quantityType",
          headerName: "Quantity Kind",
          valueGetter: (values) => {
            return values.row.quantityType;
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
            <Typography>No ingredients yet</Typography>
          </Stack>
        ),
      }}
    />
  );
};

export default IngredientTable;
