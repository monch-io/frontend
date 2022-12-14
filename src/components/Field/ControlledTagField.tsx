import { ReactElement } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import TextField, { TextFieldProps } from "@mui/material/TextField/TextField";
import { Autocomplete } from "@mui/material";

interface ControlledTagFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  textFieldProps?: TextFieldProps;
}

const ControlledTagField = <T extends FieldValues>({
  name,
  control,
  textFieldProps,
}: ControlledTagFieldProps<T>): ReactElement => {
  const {
    field: { ref: _, onChange, ...inputProps },
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: { required: true },
  });

  return (
    <Autocomplete
      {...inputProps}
      freeSolo
      options={[]}
      getOptionLabel={(option) => option}
      onChange={(_, data) => onChange(data)}
      multiple
      disableCloseOnSelect={false}
      renderInput={(params) => (
        <TextField
          {...params}
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
      )}
    />
  );
};

export default ControlledTagField;
