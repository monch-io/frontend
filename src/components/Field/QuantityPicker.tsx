import { Box, MenuItem, TextField } from "@mui/material";
import { GridRenderEditCellParams, useGridApiContext } from "@mui/x-data-grid";
import { Dimension, Unit } from "monch-backend/build/types/unit";
import { Quantity } from "monch-backend/build/types/quantity";
import { UNITS } from "../../utils/units";
import { useState } from "react";
import { ZodError } from "zod";

type GridQuantityPickerProps = GridRenderEditCellParams<{
  value: number;
  unit: Unit;
}> & {
  dimension?: Dimension;
};

export const GridQuantityPicker = (props: GridQuantityPickerProps) => {
  const { id, value, field } = props;
  const gridRef = useGridApiContext();
  const [error, setError] = useState<ZodError<Quantity> | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value; // The new value entered by the user
    const name = event.target.name;

    // We need to perform validation using the `Quantity` schema
    const update = { ...value, ...{ [name]: newValue } };
    const result = Quantity.safeParse(update);

    if (!result.success) {
      setError(result.error);
    } else {
      gridRef.current.setEditCellValue({
        id,
        field,
        value: result.data,
      });
    }
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
        value={value?.value || 0}
        sx={{ width: 80 }}
        onChange={handleChange}
        error={!!error}
      />
      <TextField
        name="unit"
        size="small"
        select
        value={value?.unit || "piece"}
        onChange={handleChange}
        variant="outlined"
        sx={{ ml: 1, width: 85 }}
        defaultValue={"piece"}
      >
        {UNITS.map((unit) => (
          <MenuItem key={unit} value={unit}>
            {unit}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
};
