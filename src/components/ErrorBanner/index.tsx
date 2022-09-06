import { ReactElement } from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

interface ErrorBannerProps {
  message: string;
  errors?: Record<string, { message: string }>;
}

export default function ErrorBanner({
  message,
  errors,
}: ErrorBannerProps): ReactElement {
  return (
    <Alert severity="error">
      <AlertTitle>Error</AlertTitle>
      <strong style={{ lineBreak: "anywhere" }}>{message}</strong>
      {typeof errors !== "undefined" && Object.keys(errors).length > 0 && (
        <ul>
          {Object.entries(errors).map(([key, value]) => {
            return (
              <li style={{ lineBreak: "anywhere" }}>
                <strong>{key}</strong>: {value.message}
              </li>
            );
          })}
        </ul>
      )}
    </Alert>
  );
}
