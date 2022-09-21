import {
  CreateIngredient,
  Ingredient,
} from "monch-backend/build/types/ingredient";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { trpc } from "../utils/trpc";
import { useCallback, useState } from "react";
import {
  Box,
  FormControl,
  Grid,
  MenuItem,
  Select,
  useTheme,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import ErrorBanner from "../components/ErrorBanner";
import FieldLabel from "../components/Field/FieldLabel";
import ControlledTextField from "../components/Field/ControlledTextField";

type MutateIngredientFormProps = {
  onCompletion?: () => void;
  // whether the mutation is creating or updating a record
} & (
  | {
      mode: "create";
      value?: undefined;
    }
  | {
      mode: "update";
      value: Ingredient;
    }
);

function MutateIngredientForm({
  onCompletion,
  mode,
  value,
}: MutateIngredientFormProps) {
  const theme = useTheme();
  const [error, setError] = useState("");

  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm<CreateIngredient>({
    resolver: zodResolver(CreateIngredient),
    reValidateMode: "onChange",
    mode: "onChange",
    defaultValues: {
      ...(mode === "update"
        ? { ...value }
        : {
            name: "",
          }),
    },
  });

  const onSuccess = () => {
    if (typeof onCompletion === "function") {
      onCompletion();
    }
  };

  // Create mutations for creating and updating the `recipe`
  const createQuery = trpc.useMutation(["ingredients.create"], {
    onSuccess,
    onError: (data) => setError(data.message),
  });
  const updateQuery = trpc.useMutation(["ingredients.update"], {
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

  const onSubmit: SubmitHandler<CreateIngredient> = async (data) => {
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
      onSubmit={handleSubmit(onSubmit)}
    >
      <Grid container maxWidth={"md"}>
        <Grid item xs={12} sx={{ pt: 1 }}>
          <FieldLabel label="Name" required />
          <ControlledTextField name="name" control={control} />
        </Grid>
        <Grid item xs={12} sx={{ pt: 1 }}>
          <FieldLabel label="Quantity Kind" required />
          <FormControl fullWidth>
            <Select
              {...register("dimension")}
              defaultValue="amount"
              disabled={mode === "update"}
              size="small"
              sx={{
                marginTop: 1,
                marginBottom: 1,
              }}
            >
              <MenuItem value="amount">amount</MenuItem>
              <MenuItem value="weight">weight</MenuItem>
              <MenuItem value="volume">volume</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sx={{ pt: 1 }}></Grid>
        <Grid>
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
                loading={isLoading() || isSubmitting}
                disabled={!isValid}
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
}

export default MutateIngredientForm;
