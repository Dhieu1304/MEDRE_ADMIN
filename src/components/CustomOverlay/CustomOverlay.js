import { Backdrop, CircularProgress } from "@mui/material";
import PropTypes from "prop-types";

function CustomOverlay({ open }) {
  return (
    open && (
      <Backdrop sx={{ color: "#fff", zIndex: (currentTheme) => currentTheme.zIndex.drawer + 1 }} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    )
  );
}

CustomOverlay.propTypes = {
  open: PropTypes.bool.isRequired
};

export default CustomOverlay;
