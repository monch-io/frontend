import { GlobalStyles, Stack, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { Meal } from "monch-backend/build/types/meal";
import { Pagination } from "monch-backend/build/types/pagination";
import { Link } from "react-router-dom";
import { RecipeLink } from "../RecipeTable";

type MealLinkProps = {
  name: string;
  id: string;
};

export const MealLink = ({ name, id }: MealLinkProps) => {
  return (
    <>
      <GlobalStyles
        styles={(theme) => ({
          ".hoverable": {
            textDecoration: "none !important",
            color: theme.palette.text.primary,
            cursor: "pointer",
            "&:hover": {
              color: theme.palette.primary.main,
            },
          },
        })}
      />
      <Link className="hoverable" to={`/meals/${id}`}>
        {name}
      </Link>
    </>
  );
};

type MealTableProps = {
  // Meals that are returned from query.
  items: Meal[];
  // Current pagination state.
  pagination: Pagination;
  // Function that handles pagination changes from the table
  onPaginationChange: (value: Pagination) => void;
};

const MealTable = ({
  items,
  pagination,
  onPaginationChange,
}: MealTableProps) => {
  return (
    <DataGrid
      autoHeight
      columns={[
        {
          field: "recipeId",
          headerName: "Recipe",
          renderCell: (values) => {
            return <RecipeLink id={values.row.recipeId} />;
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
      pageSize={pagination.take}
      rowsPerPageOptions={[pagination.take]}
      onPageChange={(page) =>
        onPaginationChange({ ...pagination, skip: page * pagination.take })
      }
      onPageSizeChange={(take) => onPaginationChange({ ...pagination, take })}
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
