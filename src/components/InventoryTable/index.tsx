import {
  DataGrid,
  GridActionsCellItem,
  GridEventListener,
  GridRenderEditCellParams,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  GridRowParams,
  GridRowsProp,
  GridToolbarContainer,
  MuiEvent,
} from "@mui/x-data-grid";
import { Button, Stack, Typography } from "@mui/material";
import type { QuantifiedIngredientRef } from "monch-backend/build/types/quantified-ingredient";
import { IngredientLink } from "../IngredientTable";
import type { Unit } from "monch-backend/build/types/unit";
import { Pagination } from "monch-backend/build/types/pagination";
import MutateInventoryItemForm from "../../forms/MutateInventoryItem";
import { useState } from "react";
import { MdEdit, MdDelete, MdSave, MdCancel } from "react-icons/md";
import { GridQuantityPicker } from "../Field/QuantityPicker";

interface InventoryTableToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
}

const InventoryTableToolbar = ({ setRows }: InventoryTableToolbarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const onComplete = (data: QuantifiedIngredientRef[]) => {
    setRows((oldRows) => [...oldRows, ...data]);
    setIsOpen(false);
  };

  return (
    <GridToolbarContainer sx={{ justifyContent: "flex-end", pt: 1 }}>
      <Button onClick={() => setIsOpen(true)}>Add item</Button>
      <MutateInventoryItemForm
        mode="create"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onCompletion={onComplete}
      />
    </GridToolbarContainer>
  );
};

type InventoryRowItem = QuantifiedIngredientRef & { isNew?: boolean };

interface InventoryTableProps {
  // All of the shown items
  items: InventoryRowItem[];
  // Current pagination state.
  pagination: Pagination;
  // Function that handles pagination changes from the table
  onPaginationChange: (value: Pagination) => void;
}

function formatQuantity(amount: number, unit: Unit | undefined): string {
  if (unit !== "piece") {
    return `${amount}${unit}`;
  } else {
    return `${amount}`;
  }
}

const InventoryTable = ({
  items,
  pagination,
  onPaginationChange,
}: InventoryTableProps) => {
  const [rows, setRows] = useState(items);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const handleRowEditStart = (
    _params: GridRowParams,
    event: MuiEvent<React.SyntheticEvent>
  ) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    _params,
    event
  ) => {
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.ingredientId === id);
    if (editedRow?.isNew) {
      setRows(rows.filter((row) => row.ingredientId !== id));
    }
  };

  const processRowUpdate = (newRow: InventoryRowItem) => {
    console.log("handling new row update");

    const updatedRow = { ...newRow, isNew: false };
    setRows(
      rows.map((row) =>
        row.ingredientId === newRow.ingredientId ? updatedRow : row
      )
    );

    return updatedRow;
  };

  return (
    <DataGrid
      pagination
      experimentalFeatures={{ newEditingApi: true }}
      autoHeight
      getRowId={(row) => row.ingredientId}
      onRowEditStart={handleRowEditStart}
      onRowEditStop={handleRowEditStop}
      columns={[
        {
          field: "name",
          headerName: "Name",
          renderCell: (values) => {
            return <IngredientLink id={values.row.ingredientId} />;
          },
          width: 300,
        },
        {
          field: "quantity",
          editable: true,
          headerName: "Amount",
          renderCell: (values) => {
            return formatQuantity(
              values.row.quantity.value,
              values.row.quantity.unit
            );
          },
          renderEditCell: (params: GridRenderEditCellParams) => {
            return <GridQuantityPicker {...params} />;
          },
          width: 200,
        },
        {
          field: "actions",
          type: "actions",
          headerName: "Actions",
          width: 100,
          cellClassName: "actions",
          getActions: ({ id }) => {
            const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

            if (isInEditMode) {
              return [
                <GridActionsCellItem
                  icon={<MdSave size={24} />}
                  label="Save"
                  onClick={handleSaveClick(id)}
                />,
                <GridActionsCellItem
                  icon={<MdCancel size={24} />}
                  label="Cancel"
                  className="textPrimary"
                  onClick={handleCancelClick(id)}
                  color="inherit"
                />,
              ];
            }

            return [
              <GridActionsCellItem
                icon={<MdEdit size={24} />}
                label="Edit"
                className="textPrimary"
                onClick={handleEditClick(id)}
                color="inherit"
              />,
              <GridActionsCellItem
                icon={<MdDelete size={24} />}
                label="Delete"
                onClick={handleDeleteClick(id)}
                color="inherit"
              />,
            ];
          },
        },
      ]}
      processRowUpdate={processRowUpdate}
      // processRowUpdate={(newRow) => {
      //   console.log(newRow);
      //   const updatedRow = { ...newRow, isNew: false };
      //   setRows(
      //     rows.map((row) =>
      //       row.ingredientId === newRow.ingredientId ? updatedRow : row
      //     )
      //   );

      //   return updatedRow;
      // }}
      rowModesModel={rowModesModel}
      rowsPerPageOptions={[pagination.take]}
      pageSize={pagination.take}
      onPageChange={(page) =>
        onPaginationChange({ ...pagination, skip: page * pagination.take })
      }
      onPageSizeChange={(take) => onPaginationChange({ ...pagination, take })}
      rows={rows}
      components={{
        NoRowsOverlay: () => (
          <Stack height="100%" alignItems="center" justifyContent="center">
            <Typography>No items yet</Typography>
          </Stack>
        ),
        Toolbar: InventoryTableToolbar,
      }}
      componentsProps={{
        toolbar: { setRows, setRowModesModel },
      }}
    />
  );
};

export default InventoryTable;
