import { Box, Link, Stack, Typography } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridEventListener,
  GridPreProcessEditCellProps,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  GridRowParams,
  MuiEvent,
} from "@mui/x-data-grid";
import type { Ingredient } from "monch-backend/build/types/ingredient";
import { Pagination } from "monch-backend/build/types/pagination";
import { useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";
import { MdEdit, MdDelete, MdSave, MdCancel } from "react-icons/md";
import ConfirmationDialogue from "../ConfirmationDialogue";
import ErrorBanner from "../ErrorBanner";
import { Title } from "../../validators/title";

interface IngredientLinkProps {
  name?: string;
  id: string;
}

export const IngredientLink = ({ name, id }: IngredientLinkProps) => {
  return <Link href={`/ingredients/${id}`}>{name ?? id}</Link>;
};

type IngredientRowItem = Ingredient;

interface IngredientTableProps {
  /** All of the shown items */
  items: IngredientRowItem[];
  /** Current pagination state. */
  pagination: Pagination;
  /** Function that handles pagination changes from the table */
  onPaginationChange: (value: Pagination) => void;
  /** Whether the external data source is still loading */
  loading?: boolean;
  /** Request for the data source to be re-fetched. */
  refetch: () => Promise<unknown>;
}

const IngredientTable = ({
  items,
  loading,
  refetch,
  pagination,
  onPaginationChange,
}: IngredientTableProps) => {
  const [rows, setRows] = useState(items);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  // Keep up-to-date with any incoming updates when searching
  useEffect(() => {
    setRows(items);
  }, [items]);

  // The `item` that is selected is used as the flag to denote whether
  // the confirmation dialogue is currently open, once it is confirmed or
  // canceled, the item is cleared and the dialogue will close.
  const [dialogueOpen, setDialogueOpen] = useState<IngredientRowItem | null>(
    null
  );

  // @@Todo: use snackbar here instead of `error`
  const [error, setError] = useState("");
  const [rowErrorMap, setRowErrorMap] = useState<Record<string, boolean>>({});

  const updateQuery = trpc.useMutation(["ingredients.update"], {
    onSuccess: refetch,
    onError: (data) => setError(data.message),
  });

  const deleteQuery = trpc.useMutation(["ingredients.delete"], {
    onSuccess: refetch,
    onError: (data) => setError(data.message),
  });

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

  const handleDeleteClick = (row: IngredientRowItem) => () => {
    setRowModesModel({
      ...rowModesModel,
      [row.id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    setDialogueOpen(row);
  };

  const onConfirmDelete = async () => {
    if (dialogueOpen !== null) {
      await deleteQuery.mutateAsync({ id: dialogueOpen.id });
    }

    // Close the dialogue
    setDialogueOpen(null);
  };

  const processRowUpdate = async (
    newRow: IngredientRowItem,
    oldRow: IngredientRowItem
  ) => {
    try {
      const { id, ...data } = newRow;
      await updateQuery.mutateAsync({ id, data });

      return newRow;
    } catch (e: unknown) {
      return oldRow;
    }
  };

  return (
    <>
      <DataGrid
        pagination
        autoHeight
        rows={rows}
        editMode={"row"}
        experimentalFeatures={{ newEditingApi: true }}
        getRowId={(row) => row.id}
        onRowEditStart={handleRowEditStart}
        onRowEditStop={handleRowEditStop}
        columns={[
          {
            field: "name",
            headerName: "Name",
            editable: true,
            renderCell: (values) => {
              return (
                <IngredientLink name={values.row.name} id={values.row.id} />
              );
            },
            preProcessEditCellProps: (
              params: GridPreProcessEditCellProps<string, IngredientRowItem>
            ) => {
              const result = Title.safeParse(params.props.value);

              // if the field has an error, we prevent the 'save' button from
              // being active...
              const hasError = !result.success;
              setRowErrorMap({
                ...rowErrorMap,
                [params.row.id]: hasError,
              });
              return { ...params.props, error: hasError };
            },
            width: 200,
          },
          {
            field: "dimension",
            editable: true,
            headerName: "Quantity Kind",
            type: "singleSelect",
            valueOptions: ["weight", "volume", "amount"],
            valueGetter: (values) => {
              return values.row.dimension;
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
              const { id } = row;
              const isInEditMode =
                rowModesModel[id]?.mode === GridRowModes.Edit;

              if (isInEditMode) {
                const hasError = rowErrorMap[id] ?? false;

                return [
                  <GridActionsCellItem
                    icon={<MdSave size={24} />}
                    label="Save"
                    onClick={handleSaveClick(id)}
                    disabled={hasError}
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
        loading={loading}
        rowModesModel={rowModesModel}
        processRowUpdate={processRowUpdate}
        rowsPerPageOptions={[pagination.take]}
        pageSize={pagination.take}
        onPageChange={(page) =>
          onPaginationChange({
            ...pagination,
            skip: (page - 1) * pagination.take,
          })
        }
        onPageSizeChange={(take) => onPaginationChange({ ...pagination, take })}
        components={{
          NoRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              <Typography>No ingredients yet</Typography>
            </Stack>
          ),
          LoadingOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              <Typography>loading</Typography>
            </Stack>
          ),
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
        submitEnabled={deleteQuery.isLoading}
        onConfirm={onConfirmDelete}
        message={`Are you sure you want to delete "${dialogueOpen?.name}" ?`}
        title={"Delete ingredient"}
      />
    </>
  );
};

export default IngredientTable;
