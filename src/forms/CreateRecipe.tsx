import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  useTheme,
} from "@mui/material";
import { CreateRecipe } from "monch-backend/build/types/recipe";
import { useEffect } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import ErrorBanner from "../components/ErrorBanner";
import ControlledTagField from "../components/Field/ControlledTagField";
import ControlledTextField from "../components/Field/ControlledTextField";
import FieldLabel from "../components/Field/FieldLabel";
import { trpc } from "../utils/trpc";

import { MdOutlineDelete } from "react-icons/md";

type CreateRecipeFormProps = {
  onCompletion?: () => void;
};

// @@Todo: move this into the backend, and this should be narrowed down by the
// unit type that is specified on the ingredient.
const UNITS = ["unit", "Kg", "g", "ml", "l"];

function CreateRecipeForm({ onCompletion }: CreateRecipeFormProps) {
  const theme = useTheme();
  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting, isValid, errors },
  } = useForm<CreateRecipe>({
    resolver: zodResolver(CreateRecipe),
    reValidateMode: "onChange",
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      tags: [],
      ingredients: [],
    },
  });

  // Register the input field for the sets
  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });

  const { isLoading, isError, data, error, mutateAsync } =
    trpc.useMutation("recipes.create");

  const onSubmit: SubmitHandler<CreateRecipe> = async (data) => {
    await mutateAsync({ ...data });
  };

  // When the request completes, we want to re-direct the user to the publication page
  useEffect(() => {
    if (data) {
      if (typeof onCompletion === "function") {
        onCompletion();
      }
    }
  }, [isLoading, isError]);

  return (
    <form
      style={{ marginTop: theme.spacing(1) }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Grid container maxWidth={"md"}>
        <Grid item xs={12} sx={{ pt: 1 }}>
          <FieldLabel label="Name" required />
          <ControlledTextField name="name" control={control} />
        </Grid>
        <Grid item xs={12} sx={{ pt: 1 }}>
          <FieldLabel label="Description" required={false} />
          <ControlledTextField name="description" control={control} />
        </Grid>
        <Grid item xs={12} sx={{ pt: 1 }}>
          <FieldLabel label="Tags" required={false} />
          <ControlledTagField name="tags" control={control} />
        </Grid>
        <Grid item xs={12} sx={{ pt: 1 }}>
          <FieldLabel label="Ingredients" required />
          {fields.map((_, index: number) => {
            const { ingredients } = errors;
            const nameError = ingredients?.[index]?.ingredientId ?? "";
            const quantityError = ingredients?.[index]?.quantity ?? "";

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
                <TextField
                  size="small"
                  variant="outlined"
                  {...register(`ingredients.${index}.ingredientId`)}
                  {...(nameError !== ""
                    ? {
                        error: true,
                        helperText: nameError.message ?? "",
                      }
                    : {
                        sx: {
                          pb: 2.5,
                        },
                      })}
                />
                <Box>
                  <TextField
                    size="small"
                    variant="outlined"
                    type="number"
                    {...register(`ingredients.${index}.quantity`, {
                      valueAsNumber: true,
                    })}
                    {...(quantityError !== ""
                      ? {
                          error: true,
                          helperText: quantityError.message ?? "",
                        }
                      : {
                          sx: {
                            pb: 2.5,
                          },
                        })}
                  />
                  <TextField
                    size="small"
                    select
                    variant="outlined"
                    sx={{ ml: 1, width: 80 }}
                    defaultValue={"unit"}
                  >
                    {UNITS.map((unit) => (
                      <MenuItem key={unit} value={unit}>
                        {unit}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
                <IconButton onClick={() => remove(index)} sx={{ mb: 2.5 }}>
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

        <Grid item xs={12} sx={{ pt: 1 }}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {isError && error && <ErrorBanner message={error.message} />}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                flexDirection: "row",
                pt: 1,
              }}
            >
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
          </Box>
        </Grid>
      </Grid>
    </form>
  );
}

export default CreateRecipeForm;
