import { styled } from "@mui/material/styles";

const CustomDrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar
  // backgroundColor: "#2b6777"
}));

export default CustomDrawerHeader;
