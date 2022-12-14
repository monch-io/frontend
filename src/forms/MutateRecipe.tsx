import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Grid, IconButton, useTheme } from "@mui/material";
import { CreateRecipe, Recipe } from "monch-backend/build/types/recipe";
import {
  SubmitHandler,
  useFieldArray,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import ErrorBanner from "../components/ErrorBanner";
import ControlledTagField from "../components/Field/ControlledTagField";
import ControlledTextField from "../components/Field/ControlledTextField";
import FieldLabel from "../components/Field/FieldLabel";
import { trpc } from "../utils/trpc";
import { MdOutlineDelete } from "react-icons/md";
import { useCallback, useState } from "react";
import ControlledIngredientField from "../components/Field/ControlledIngredientField";
import ControlledQuantityPicker from "../components/Field/ControlledQuantityPicker";

interface IngredientSelectionListProps {
  form: UseFormReturn<CreateRecipe>;
}

const IngredientSelectionList = ({
  form: { control },
}: IngredientSelectionListProps) => {
  // Register the input field for the sets
  const { fields, append, update, remove } = useFieldArray({
    control,
    name: "ingredients",
  });

  return (
    <Grid item xs={12} sx={{ pt: 1 }}>
      <FieldLabel label="Ingredients" required />
      {fields.map((item, index: number) => {
        return (
          <Box
            key={index}
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              flexDirection: "row",
              pt: 0.5,
              pb: 0.5,
            }}
          >
            <ControlledIngredientField
              control={control}
              name={`ingredients.${index}.ingredientId`}
              initialIngredientId={item.ingredientId}
              onUnitChange={(unit) => {
                update(index, {
                  ...item,
                  quantity: { ...item.quantity, unit },
                });
              }}
            />
            <ControlledQuantityPicker
              name={`ingredients.${index}.quantity.value`}
              control={control}
              unit={item.quantity.unit}
            />
            <IconButton onClick={() => remove(index)}>
              <MdOutlineDelete color="error" />
            </IconButton>
          </Box>
        );
      })}
      <Button
        onClick={() =>
          append({
            ingredientId: "",
            quantity: { value: 0, unit: "piece" },
          })
        }
      >
        Add ingredient
      </Button>
    </Grid>
  );
};

type MutateRecipeFormProps = {
  onCompletion?: () => void;

  // whether the mutation is creating or updating a record
} & (
  | {
      mode: "create";
      value?: undefined;
    }
  | {
      mode: "update";
      value: Recipe;
    }
);

const MutateRecipeForm = ({
  onCompletion,
  mode,
  value,
}: MutateRecipeFormProps) => {
  const theme = useTheme();
  const [error, setError] = useState("");

  const form = useForm<CreateRecipe>({
    resolver: zodResolver(CreateRecipe),
    reValidateMode: "onChange",
    mode: "onChange",
    defaultValues: {
      ...(mode === "update"
        ? { ...value }
        : {
            name: "",
            description: "",
            tags: [],
            ingredients: [],
          }),
    },
  });

  const onSuccess = () => {
    if (typeof onCompletion === "function") {
      onCompletion();
    }
  };

  // Create mutations for creating and updating the `recipe`
  const createQuery = trpc.useMutation(["recipes.create"], {
    onSuccess,
    onError: (data) => setError(data.message),
  });
  const updateQuery = trpc.useMutation(["recipes.update"], {
    onSuccess,
    onError: (data) => setError(data.message),
  });

  const isLoading = useCallback(() => {
    if (mode === "update") {
      return updateQuery.isLoading;
    } else {
      return createQuery.isLoading;
    }
  }, [createQuery.isLoading, updateQuery.isLoading]);

  const onSubmit: SubmitHandler<CreateRecipe> = async (data) => {
    // reset the error since we're re-submitting
    setError("");

    if (mode === "update") {
      await updateQuery.mutateAsync({ data, id: value.id });
    } else {
      await createQuery.mutateAsync({ ...data });
    }
  };

  return (
    <form
      style={{ marginTop: theme.spacing(1) }}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Grid container maxWidth={"md"}>
        <Grid item xs={12} sx={{ pt: 1 }}>
          <FieldLabel label="Name" required />
          <ControlledTextField name="name" control={form.control} />
        </Grid>
        <Grid item xs={12} sx={{ pt: 1 }}>
          <FieldLabel label="Description" required={false} />
          <ControlledTextField name="description" control={form.control} />
        </Grid>
        <Grid item xs={12} sx={{ pt: 1 }}>
          <FieldLabel label="Tags" required={false} />
          <ControlledTagField name="tags" control={form.control} />
        </Grid>
        <IngredientSelectionList form={form} />
        <Grid item xs={12} sx={{ pt: 1 }}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {error !== "" && <ErrorBanner message={error} />}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                flexDirection: "row",
                pt: 1,
              }}
            >
              <LoadingButton
                loading={isLoading() || form.formState.isSubmitting}
                disabled={!form.formState.isValid}
                color="primary"
                variant={"contained"}
                type="submit"
              >
                {mode === "update" ? "Update" : "Create"}
              </LoadingButton>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
};

export default MutateRecipeForm;
