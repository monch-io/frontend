import { z } from "zod";
import { useState } from "react";
import { Box, InputAdornment, TextField } from "@mui/material";
import { Dimension, Unit } from "monch-backend/build/types/unit";
import { GridRenderEditCellParams, useGridApiContext } from "@mui/x-data-grid";
import { expr } from "../../utils/expr";

interface GridQuantityPickerProps
  extends GridRenderEditCellParams<{
    value: number;
    unit?: Unit;
  }> {
  dimension: Dimension;
}

function getDisplayUnitForDimension(dimension: Dimension): string {
  if (dimension === "weight") {
    return "kg";
  } else if (dimension === "volume") {
    return "l";
  } else {
    return "";
  }
}

export const QuantityUpdate = z.object({
  value: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().nonnegative()
  ),
  unit: Unit,
});

export const GridQuantityPicker = (props: GridQuantityPickerProps) => {
  const { id, value, field, dimension } = props;
  const [fieldValues, setFieldValues] = useState({
    unit: value?.unit?.toString() ?? "piece",
    value: value?.value.toString() ?? "0",
  });

  const gridRef = useGridApiContext();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const update = { ...fieldValues, ...{ [name]: event.target.value } };

    // Update the value of the fields state
    setFieldValues(update);
    const result = QuantityUpdate.safeParse(update);

    const newValue = expr(() => {
      if (result.success) {
        return { ...result.data, hasError: false };
      } else {
        return { ...value, hasError: true };
      }
    });

    gridRef.current.setEditCellValue({
      id,
      field,
      value: newValue,
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "row",
        flex: 1,
      }}
    >
      <TextField
        name="value"
        size="small"
        variant="outlined"
        value={fieldValues.value}
        sx={{ width: 80 }}
        onChange={handleChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {getDisplayUnitForDimension(dimension)}
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};
