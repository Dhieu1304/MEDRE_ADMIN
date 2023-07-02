import PropTypes from "prop-types";
import { Button, useTheme } from "@mui/material";

function ViewBookingBtn({ label, onClick }) {
  const theme = useTheme();

  return (
    <Button
      variant="contained"
      sx={{
        backgroundColor: "inherit",
        color: theme.palette.info.light,
        ":hover": {
          background: theme.palette.info.light,
          color: theme.palette.info.contrastText
        }
      }}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}

ViewBookingBtn.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

export default ViewBookingBtn;
