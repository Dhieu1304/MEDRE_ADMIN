import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";

function SectionContent({ title, children }) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

SectionContent.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

export default SectionContent;
