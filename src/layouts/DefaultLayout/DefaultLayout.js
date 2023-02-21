import { Box } from "@mui/material";
import PropTypes from "prop-types";
import Header from "../components/Header";

function DefaultLayout({ children }) {
  return (
    <Box sx={{ width: "100vw", minHeight: "100vh" }}>
      <Header />
      <Box sx={{ width: "100%", height: "100%" }}>{children}</Box>;
    </Box>
  );
}

DefaultLayout.propTypes = {
  children: PropTypes.node.isRequired
};

export default DefaultLayout;
