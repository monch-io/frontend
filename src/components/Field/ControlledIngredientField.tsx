import { Autocomplete, TextField } from "@mui/material";
import { Ingredient } from "monch-backend/build/types/ingredient";
import { Dimension, Unit } from "monch-backend/build/types/unit";
import { useEffect, useState } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { trpc } from "../../utils/trpc";

function getUnitFromDimension(dimension: Dimension): Unit {
  if (dimension === "volume") {
    return "l";
  } else if (dimension === "weight") {
    return "kg";
  } else {
    return "piece";
  }
}

interface IngredientFieldProps<T extends FieldValues> {
  /** The name of the field that this function is registering too */
  name: Path<T>;
  /** The associated `react-hook-form` form controller */
  control: Control<T>;
  /** Function used to propagate the derived `dimension` value from the selected ingredient */
  onUnitChange: (unit: Unit) => void;
  /** The ID of the ingredient */
  initialIngredientId?: string;
}

/** This component should handle the selection of the ingredient and thus deriving the `quantity.dimension` based on the selected ingredient */
const ControlledIngredientField = <T extends FieldValues>({
  control,
  name,
  onUnitChange,
  initialIngredientId,
}: IngredientFieldProps<T>) => {
  const [open, setOpen] = useState(false);

  const {
    field: { ref: _, onChange, onBlur },
  } = useController({
    name,
    control,
    rules: { required: true },
  });

  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<Ingredient[]>([]);

  // Use this query to initially load the passed in ingredient value
  const getIngredient = trpc.useQuery(
    ["ingredients.findById", { id: initialIngredientId ?? "" }],
    { enabled: false }
  );

  useEffect(() => {
    async function loadValue() {
      if (typeof initialIngredientId !== "undefined") {
        const ingredient = await getIngredient.refetch();

        if (
          ingredient.data !== null &&
          typeof ingredient.data !== "undefined"
        ) {
          setInputValue(ingredient.data.name);
        }
      }
    }

    loadValue();
  }, [initialIngredientId]);

  const searchIngredients = trpc.useQuery(
    [
      "ingredients.search",
      { query: { text: inputValue }, pagination: { take: 10, skip: 0 } },
    ],
    {
      onSuccess: (data) => {
        setOptions(data.items);
      },
    }
  );

  return (
    <Autocomplete
      value={inputValue}
      onInputChange={(_, value) => {
        setInputValue(value);
      }}
      onBlur={onBlur}
      onChange={(_, item) => {
        // We need to specifically get the name of the item that we pick.
        if (item !== null && typeof item !== "string") {
          onUnitChange(getUnitFromDimension(item.dimension));
          onChange(item.id);
        }
      }}
      freeSolo
      sx={{ width: 300 }}
      open={open}
      options={options}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      inputMode={"search"}
      openOnFocus
      disableCloseOnSelect={false}
      clearOnEscape
      loading={searchIngredients.isLoading}
      getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.name)}
      renderInput={(params) => (
        <TextField
          {...params}
          className=""
          variant="outlined"
          size="small"
          placeholder={"Search ingredients"}
          sx={{ background: "white" }}
        />
      )}
    />
  );
};

export default ControlledIngredientField;
