import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from "react-router-dom";
import { createTheme, LinkProps } from "@mui/material";
import { forwardRef } from "react";

const LinkBehavior = forwardRef<
  HTMLAnchorElement,
  Omit<RouterLinkProps, "to"> & { href: RouterLinkProps["to"] }
>((props, ref) => {
  const { href, ...other } = props;
  // Map href (MUI) -> to (react-router)
  return <RouterLink ref={ref} to={href} {...other} />;
});

// The application theme
const Theme = createTheme({
  palette: {
    primary: {
      main: "#0076FF",
    },
    secondary: {
      main: "#37123C",
    },
    text: {
      primary: "#303035",
      secondary: "#303035",
    },
  },
  typography: {
    fontSize: 12,
    fontFamily: [
      "Noto Sans",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    button: {
      textTransform: "none",
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },

  components: {
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
        underline: "none",
        sx: {
          color: (t) => t.palette.text.primary,
          "&:hover": {
            color: (t) => t.palette.primary.main,
          },
        },
      } as LinkProps,
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          background: "#fff !important",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableRipple: true,
        disableElevation: true,
        variant: "contained",
        size: "small",
        sx: {
          fontWeight: "bold",
        },
      },
    },
  },
});

export default Theme;
