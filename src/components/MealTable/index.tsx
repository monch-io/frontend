import { Stack, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { Meal } from "monch-backend/src/types/meal";

type MealTableProps = {
  items: Meal[];
  pageSize?: number;
};

const MealTable = ({ items, pageSize = 20 }: MealTableProps) => {
  return (
    <DataGrid
      autoHeight
      columns={[
        {
          field: "recipeId",
          headerName: "Recipe",
          valueGetter: (values) => {
            return values.row.recipeId;
          },
          width: 200,
        },
        {
          field: "date",
          headerName: "Date",
          valueGetter: (values) => {
            return values.row.date.toLocaleDateString("en-GB");
          },
          width: 200,
        },
      ]}
      pageSize={pageSize}
      rowsPerPageOptions={[pageSize]}
      rows={items}
      components={{
        NoRowsOverlay: () => (
          <Stack height="100%" alignItems="center" justifyContent="center">
            <Typography>No meals yet</Typography>
          </Stack>
        ),
      }}
    />
  );
};

export default MealTable;
