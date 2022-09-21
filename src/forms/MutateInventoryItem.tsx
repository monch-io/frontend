import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import { QuantifiedIngredientRef } from "monch-backend/build/types/quantified-ingredient";
import { SubmitHandler, useForm } from "react-hook-form";
import ErrorBanner from "../components/ErrorBanner";
import ControlledQuantityPicker from "../components/Field/ControlledQuantityPicker";
import FieldLabel from "../components/Field/FieldLabel";
import ControlledIngredientField from "../components/Field/ControlledIngredientField";
import { trpc } from "../utils/trpc";

type MutateInventoryItemFormProps = {
  onClose: () => void;
  onCompletion?: (changes: QuantifiedIngredientRef[]) => void;
  isOpen: boolean;
} & (
  | {
      mode: "create";
      value?: undefined;
    }
  | {
      mode: "update";
      value: QuantifiedIngredientRef;
    }
);

const MutateInventoryItemForm = ({
  onClose,
  onCompletion,
  isOpen,
  mode,
  value,
}: MutateInventoryItemFormProps) => {
  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { isValid, isSubmitting },
  } = useForm<QuantifiedIngredientRef>({
    resolver: zodResolver(QuantifiedIngredientRef),
    reValidateMode: "onChange",
    mode: "onChange",
    defaultValues: {
      ...(mode === "update"
        ? { ...value }
        : {
            ingredientId: "",
            quantity: {
              value: 0,
              unit: "piece",
            },
          }),
    },
  });

  const { isLoading, isError, error, mutateAsync } = trpc.useMutation(
    ["inventory.updateInventory"],
    {
      onSuccess: (_, data) => {
        onClose();

        if (typeof onCompletion === "function") {
          onCompletion(data.changes);
        }
      },
    }
  );

  const onSubmit: SubmitHandler<QuantifiedIngredientRef> = async (data) => {
    mutateAsync({ changes: [data] });
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <form
        style={{ width: "100%", marginTop: "8px" }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <DialogTitle>Update Inventory</DialogTitle>
        <DialogContent>
          <Grid container maxWidth={"lg"}>
            <Grid item xs={12} sx={{ pt: 1 }}>
              <FieldLabel label="Ingredient" required />
              <ControlledIngredientField
                name={"ingredientId"}
                control={control}
                onUnitChange={(unit) => setValue("quantity.unit", unit)}
              />
            </Grid>
            <Grid item xs={12} sx={{ pt: 1 }}>
              <ControlledQuantityPicker
                control={control}
                name={`quantity.value`}
                unit={getValues(`quantity.unit`)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ display: "flex", flexDirection: "column" }}>
          {isError && error && <ErrorBanner message={error.message} />}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              width: "100%",
              flexDirection: "row",
              pt: 1,
            }}
          >
            <Button color="secondary" variant={"text"} onClick={onClose}>
              Cancel
            </Button>
            <LoadingButton
              loading={isLoading || isSubmitting}
              disabled={!isValid}
              color="primary"
              variant={"contained"}
              type="submit"
            >
              Create
            </LoadingButton>
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default MutateInventoryItemForm;
