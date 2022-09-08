import { ReactElement } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import TextField, { TextFieldProps } from "@mui/material/TextField/TextField";

interface ControlledTextFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  textFieldProps?: TextFieldProps;
}

export default function ControlledTextField<T extends FieldValues>({
  name,
  control,
  textFieldProps,
}: ControlledTextFieldProps<T>): ReactElement {
  const {
    field: { ref: _, ...inputProps },
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: { required: true },
  });

  return (
    <TextField
      {...inputProps}
      size="small"
      fullWidth
      sx={{
        marginTop: 1,
        marginBottom: 1,
      }}
      {...textFieldProps}
      {...(typeof error !== "undefined" && {
        error: true,
        helperText: error.message,
      })}
    />
  );
}
