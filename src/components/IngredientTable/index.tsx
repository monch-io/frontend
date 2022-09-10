import { GlobalStyles, Stack, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { Ingredient } from "monch-backend/build/types/ingredient";
import { Pagination } from "monch-backend/build/types/pagination";
import { Link } from "react-router-dom";

type IngredientLinkProps = {
  name: string;
  id: string;
};

export const IngredientLink = ({ name, id }: IngredientLinkProps) => {
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
      <Link className="hoverable" to={`/ingredients/${id}`}>
        {name}
      </Link>
    </>
  );
};

type IngredientTableProps = {
  // All of the shown items
  items: Ingredient[];

  // Current pagination state.
  pagination: Pagination;

  // Function that handles pagination changes from the table
  onPaginationChange: (value: Pagination) => void;
};

const IngredientTable = ({
  items,
  pagination,
  onPaginationChange,
}: IngredientTableProps) => {
  return (
    <DataGrid
      autoHeight
      checkboxSelection
      columns={[
        {
          field: "name",
          headerName: "Name",
          editable: true,
          renderCell: (values) => {
            return <IngredientLink name={values.row.name} id={values.row.id} />;
          },
          width: 200,
        },
        {
          field: "quantityType",
          editable: true,
          headerName: "Quantity Kind",
          type: "singleSelect",
          valueOptions: ["weight", "volume", "piece"],
          valueGetter: (values) => {
            return values.row.dimension;
          },
          width: 200,
        },
      ]}
      onCellEditCommit={(details) => {
        console.log(details);
      }}
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
            <Typography>No ingredients yet</Typography>
          </Stack>
        ),
      }}
    />
  );
};

export default IngredientTable;
