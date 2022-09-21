import { InputAdornment, TextField } from "@mui/material";
import { Unit } from "monch-backend/build/types/unit";
import { useState } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { z } from "zod";

interface ControlledQuantityPickerProps<T extends FieldValues> {
  /** The name of the field that this function is registering too */
  name: Path<T>;
  /** The associated `react-hook-form` form controller */
  control: Control<T>;
  /** The associated `unit` of the currently selected ingredient where this ingredient is selected */
  unit?: Unit;
}

const NumberValue = z.preprocess(
  (a) => parseFloat(z.string().parse(a)),
  z.number().nonnegative()
);

const ControlledQuantityPicker = <T extends FieldValues>({
  control,
  name,
  unit,
}: ControlledQuantityPickerProps<T>) => {
  const {
    field: { ref: _, value, onChange, ...inputProps },
  } = useController({
    name,
    control,
    rules: { required: true },
  });
  const [inputValue, setInputValue] = useState(value.toString());

  return (
    <TextField
      value={inputValue}
      {...inputProps}
      onChange={(event) => {
        const rawValue = event.target.value;
        const result = NumberValue.safeParse(rawValue);

        if (result.success) {
          onChange(result.data);
        }

        setInputValue(rawValue);
      }}
      name="value"
      size="small"
      variant="outlined"
      sx={{ width: 80 }}
      {...(typeof unit !== "undefined" &&
        unit !== "piece" && {
          InputProps: {
            endAdornment: (
              <InputAdornment position="end">{unit}</InputAdornment>
            ),
          },
        })}
    />
  );
};

export default ControlledQuantityPicker;
