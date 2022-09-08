import { CreateIngredient } from "monch-backend/build/types/ingredient";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { trpc } from "../utils/trpc";
import { useEffect } from "react";
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

type CreateIngredientFormProps = {
  onCompletion?: () => void;
};

function CreateIngredientForm({ onCompletion }: CreateIngredientFormProps) {
  const theme = useTheme();
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
      name: "",
    },
  });

  const { isLoading, isError, data, error, mutateAsync } =
    trpc.useMutation("ingredients.create");

  const onSubmit: SubmitHandler<CreateIngredient> = async (data) => {
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
          <FieldLabel label="Quantity Kind" required />
          <FormControl fullWidth>
            <Select
              {...register(`quantityType`)}
              defaultValue="continuous"
              size="small"
              sx={{
                marginTop: 1,
                marginBottom: 1,
              }}
            >
              <MenuItem value="continuous">continuous</MenuItem>
              <MenuItem value="discrete">discrete</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sx={{ pt: 1 }}></Grid>
        <Grid>
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

export default CreateIngredientForm;
