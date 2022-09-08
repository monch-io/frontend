import { Chip, GlobalStyles, Stack, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Pagination } from "monch-backend/build/types/pagination";
import type { RecipeWithoutIngredients } from "monch-backend/build/types/recipe";
import { Fragment } from "react";
import { Link } from "react-router-dom";

type RecipeLinkProps = {
  name?: string;
  id: string;
};

export const RecipeLink = ({ name, id }: RecipeLinkProps) => {
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
      <Link className="hoverable" to={`/recipes/${id}`}>
        {name || id}
      </Link>
    </>
  );
};

type RecipeTableProps = {
  // Meals that are returned from query.
  items: RecipeWithoutIngredients[];
  // Current pagination state.
  pagination: Pagination;
  // Function that handles pagination changes from the table
  onPaginationChange: (value: Pagination) => void;
};

const RecipeTable = ({
  items,
  pagination,
  onPaginationChange,
}: RecipeTableProps) => {
  return (
    <DataGrid
      autoHeight
      columns={[
        {
          field: "name",
          headerName: "Name",
          renderCell: (values) => {
            return <RecipeLink name={values.row.name} id={values.row.id} />;
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
        {
          field: "canPrepare",
          headerName: "Can prepare",
          renderCell: () => {
            return "unknown"; // @@TODO: accept information about whether it could be prepared
          },
          width: 200,
        },
      ]}
      rowsPerPageOptions={[pagination.take]}
      pageSize={pagination.take}
      onPageChange={(page) =>
        onPaginationChange({ ...pagination, skip: page * pagination.take })
      }
      onPageSizeChange={(take) => onPaginationChange({ ...pagination, take })}
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
