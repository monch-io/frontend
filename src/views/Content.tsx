import { Box, Button, Divider, Typography } from "@mui/material";
import { Link, Outlet, useLocation } from "react-router-dom";

type ContentKind = "recipes" | "meals" | "ingredients" | "inventory";

type ContentLayoutProps = {
  title: string;
  kind: ContentKind;
};

function ContentLayout({ title, kind }: ContentLayoutProps) {
  const { pathname } = useLocation();
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Typography variant={"h4"}>{title}</Typography>

        {!pathname.endsWith("/new") && (
          <Link
            to={`/${kind}/new`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Button variant="contained">Create</Button>
          </Link>
        )}
      </Box>
      <Divider />
      <Box sx={{ pt: 1 }}>
        <Outlet />
      </Box>
    </Box>
  );
}

export default ContentLayout;
