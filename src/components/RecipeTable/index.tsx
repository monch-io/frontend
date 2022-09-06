import { Chip, Stack, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { Recipe } from "monch-backend/src/types/recipe";
import { Fragment } from "react";

type RecipeTableProps = {
  items: Recipe[];
  pageSize?: number;
};

const RecipeTable = ({ items, pageSize = 20 }: RecipeTableProps) => {
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
          field: "description",
          headerName: "Description",
          valueGetter: (values) => {
            return values.row.description || "-";
          },
          width: 300,
        },
        {
          field: "tags",
          headerName: "Tags",
          renderCell: (values) => {
            return (
              <Fragment>
                {values.row.tags.map((tag) => (
                  <Chip key={tag} label={tag} size={"small"} />
                ))}
              </Fragment>
            );
          },
          width: 300,
        },
      ]}
      rowsPerPageOptions={[pageSize]}
      pageSize={pageSize}
      rows={items}
      components={{
        NoRowsOverlay: () => (
          <Stack height="100%" alignItems="center" justifyContent="center">
            <Typography>No recipes yet</Typography>
          </Stack>
        ),
      }}
    />
  );
};

export default RecipeTable;
