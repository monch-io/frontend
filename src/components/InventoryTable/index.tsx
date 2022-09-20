import {
  DataGrid,
  GridActionsCellItem,
  GridEventListener,
  GridPreProcessEditCellProps,
  GridRenderEditCellParams,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  GridRowParams,
  GridToolbarContainer,
  MuiEvent,
} from "@mui/x-data-grid";
import { Box, Button, Stack, Typography } from "@mui/material";
import type { QuantifiedIngredient } from "monch-backend/build/types/quantified-ingredient";
import { IngredientLink } from "../IngredientTable";
import type { Unit } from "monch-backend/build/types/unit";
import { Pagination } from "monch-backend/build/types/pagination";
import MutateInventoryItemForm from "../../forms/MutateInventoryItem";
import { useCallback, useEffect, useState } from "react";
import { MdEdit, MdDelete, MdSave, MdCancel } from "react-icons/md";
import { GridQuantityPicker } from "../Field/QuantityPicker";
import ConfirmationDialogue from "../ConfirmationDialogue";
import { trpc } from "../../utils/trpc";
import ErrorBanner from "../ErrorBanner";
import { Quantity } from "monch-backend/build/types/quantity";

interface InventoryTableToolbarProps {
  refetch: () => Promise<void>;
}

const InventoryTableToolbar = ({ refetch }: InventoryTableToolbarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const onComplete = async () => {
    await refetch();
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

function formatQuantity(amount: number, unit: Unit | undefined): string {
  if (unit !== "piece") {
    return `${amount}${unit}`;
  } else {
    return `${amount}`;
  }
}

type InventoryRowItem = QuantifiedIngredient;

interface InventoryTableProps {
  /** All of the shown items */
  items: InventoryRowItem[];
  /** Current pagination state. */
  pagination: Pagination;
  /** Function that handles pagination changes from the table */
  onPaginationChange: (value: Pagination) => void;
  /** Whether the external data source is still loading */
  loading?: boolean;
  /** Request for the data source to be re-fetched. */
  refetch: () => Promise<unknown>;
}

const InventoryTable = ({
  items,
  loading,
  refetch,
  pagination,
  onPaginationChange,
}: InventoryTableProps) => {
  const [rows, setRows] = useState(items);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  // Keep up-to-date with any incoming updates when searching
  useEffect(() => {
    setRows(items);
  }, [items]);

  // The `item` that is selected is used as the flag to denote whether
  // the confirmation dialogue is currently open, once it is confirmed or
  // canceled, the item is cleared and the dialogue will close.
  const [dialogueOpen, setDialogueOpen] = useState<InventoryRowItem | null>(
    null
  );

  // @@Todo: use snackbar here instead of `error`
  const [error, setError] = useState("");
  const [rowErrorMap, setRowErrorMap] = useState<Record<string, boolean>>({});

  const updateQuery = trpc.useMutation(
    ["inventory.setQuantityForIngredients"],
    {
      onSuccess: () => {
        // Reset the error if any, and refetch all of the items for the current row
        setError("");
        refetch();
      },
      onError: (err) => setError(err.message),
      retry: false,
    }
  );

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
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  const handleDeleteClick = (row: InventoryRowItem) => () => {
    setRowModesModel({
      ...rowModesModel,
      [row.ingredient.id]: {
        mode: GridRowModes.View,
        ignoreModifications: true,
      },
    });

    setDialogueOpen(row);
  };

  const onConfirmDelete = async () => {
    if (dialogueOpen !== null) {
      await updateQuery.mutateAsync({
        changes: [
          {
            quantity: { value: 0 },
            ingredientId: dialogueOpen.ingredient.id,
          },
        ],
      });
    }

    // Close the dialogue
    setDialogueOpen(null);
  };

  const processRowUpdate = useCallback(
    async (newRow: InventoryRowItem, oldRow: InventoryRowItem) => {
      try {
        const {
          ingredient: { id: ingredientId },
          quantity,
        } = newRow;

        await updateQuery.mutateAsync({
          changes: [{ ingredientId, quantity }],
        });

        return newRow;
      } catch (e: unknown) {
        return oldRow;
      }
    },
    [updateQuery.mutateAsync]
  );

  return (
    <>
      <DataGrid
        pagination
        experimentalFeatures={{ newEditingApi: true }}
        autoHeight
        onRowEditStart={handleRowEditStart}
        onRowEditStop={handleRowEditStop}
        getRowId={(row) => row.ingredient.id}
        editMode={"row"}
        columns={[
          {
            field: "name",
            headerName: "Name",
            renderCell: (values) => {
              const { id, name } = values.row.ingredient;
              return <IngredientLink id={id} name={name} />;
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
            renderEditCell: (params: GridRenderEditCellParams<Quantity>) => {
              const { dimension } = params.row.ingredient;
              return <GridQuantityPicker {...params} dimension={dimension} />;
            },
            preProcessEditCellProps: (
              params: GridPreProcessEditCellProps<{ hasError: boolean }>
            ) => {
              const hasError = params.props.value?.hasError;

              // if the field has an error, we prevent the 'save' button from
              // being active...
              setRowErrorMap({
                ...rowErrorMap,
                [params.row.ingredient.id]: hasError,
              });
              return { ...params.props, error: hasError };
            },
            width: 200,
          },
          {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            width: 100,
            cellClassName: "actions",
            getActions: ({ row }) => {
              const { id } = row.ingredient;

              const isInEditMode =
                rowModesModel[id]?.mode === GridRowModes.Edit;

              if (isInEditMode) {
                const hasError = rowErrorMap[id] ?? false;

                return [
                  <GridActionsCellItem
                    icon={<MdSave size={24} />}
                    label="Save"
                    disabled={hasError}
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
                  onClick={handleDeleteClick(row)}
                  color="inherit"
                />,
              ];
            },
          },
        ]}
        processRowUpdate={processRowUpdate}
        loading={loading}
        rowModesModel={rowModesModel}
        rowsPerPageOptions={[pagination.take]}
        pageSize={pagination.take}
        onPageChange={(page) =>
          onPaginationChange({
            ...pagination,
            skip: (page - 1) * pagination.take,
          })
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
          LoadingOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              <Typography>loading</Typography>
            </Stack>
          ),
        }}
        componentsProps={{
          toolbar: { refetch },
        }}
      />
      {error !== "" && (
        <Box sx={{ mt: 1 }}>
          <ErrorBanner message={error} />
        </Box>
      )}
      <ConfirmationDialogue
        isOpen={dialogueOpen !== null}
        onClose={() => setDialogueOpen(null)}
        submitEnabled={updateQuery.isLoading}
        onConfirm={onConfirmDelete}
        message={`Are you sure you want to remove this "${dialogueOpen?.ingredient.name}" from the inventory ?`}
        title={"Remove item from inventory"}
      />
    </>
  );
};

export default InventoryTable;
