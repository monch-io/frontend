import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

type FieldLabelProps = {
  label: string;
  required?: boolean;
};

export default function FieldLabel({
  label,
  required = true,
}: FieldLabelProps) {
  return (
    <Typography variant={"body2"} sx={{ fontWeight: "bold" }}>
      {label}
      {required && (
        <Box component={"span"} sx={{ color: (t) => t.palette.error.main }}>
          *
        </Box>
      )}
    </Typography>
  );
}
