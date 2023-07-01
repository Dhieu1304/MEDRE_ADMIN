import MuiDrawer from "@mui/material/Drawer";
import { styled } from "@mui/material/styles";
import { DRAWER_WIDTH } from "../../config/slytesConfig";

const openedMixin = (theme) => ({
  width: DRAWER_WIDTH,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),
  overflowX: "hidden"
  // backgroundColor: "#2b6777",
  // color: "white"
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`
  }
  // backgroundColor: "#2b6777",
  // color: "white"
});

const CustomDrawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" && prop !== "isMobile" })(
  ({ theme, open, isMobile }) => ({
    width: DRAWER_WIDTH,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    position: open && isMobile ? "absolute" : "relative",
    ...(open && {
      ...openedMixin(theme),
      "& .MuiDrawer-paper": openedMixin(theme)
    }),
    ...(!open && {
      ...closedMixin(theme),
      "& .MuiDrawer-paper": closedMixin(theme)
    })
  })
);

export default CustomDrawer;
