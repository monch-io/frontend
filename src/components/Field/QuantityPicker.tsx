import { z } from "zod";
import { useState } from "react";
import { DefaultUnit, Units } from "../../utils/units";
import { Box, MenuItem, TextField } from "@mui/material";
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

export const QuantityUpdate = z.object({
  value: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive()
  ),
  unit: Unit,
});

export const GridQuantityPicker = (props: GridQuantityPickerProps) => {
  const { id, value, field, dimension } = props;
  const [fieldValues, setFieldValues] = useState({
    unit: value?.unit?.toString() ?? DefaultUnit[dimension],
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
      />
      <TextField
        name="unit"
        size="small"
        select
        value={fieldValues.unit}
        onChange={handleChange}
        disabled={dimension === "amount"}
        variant="outlined"
        sx={{ ml: 1, width: 85 }}
        defaultValue={DefaultUnit[dimension]}
      >
        {Units[dimension].map((unit) => (
          <MenuItem key={unit} value={unit}>
            {unit}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
};
