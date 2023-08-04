import PropTypes from "prop-types";
import { Button, useTheme } from "@mui/material";

function BookingBtn({ label, onClick }) {
  const theme = useTheme();

  return (
    <Button
      variant="contained"
      sx={{
        backgroundColor: "inherit",
        color: theme.palette.success.light,
        ":hover": {
          background: theme.palette.success.light,
          color: theme.palette.success.contrastText
        }
      }}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}

BookingBtn.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

export default BookingBtn;
