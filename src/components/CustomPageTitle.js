import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";

function CustomPageTitle({ title, right }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { md: "row", xs: "column" },
        justifyContent: { md: "space-between", xs: "flex-start" },
        alignItems: { md: "center", xs: "flex-start" },
        mb: 2
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", mr: 4, mb: { md: 0, xs: 1 } }}>
        <Typography component="h1" variant="h4" fontWeight={600} fontSize={{ sm: 30, xs: 22 }}>
          {title}
        </Typography>
      </Box>
      <Box>{right}</Box>
    </Box>
  );
}
CustomPageTitle.defaultProps = {
  right: undefined
};

CustomPageTitle.propTypes = {
  title: PropTypes.string.isRequired,
  right: PropTypes.node
};

export default CustomPageTitle;
