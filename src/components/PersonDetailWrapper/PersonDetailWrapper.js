import PropTypes from "prop-types";
import { Box } from "@mui/material";

import PersonHeadInfo from "./PersonDetailHeadInfo";
import PersonDetailAction from "./PersonDetailAction";

function PersonDetailWrapper({ person, children, canUpdate, handleReset, handleSave }) {
  return (
    <Box
      sx={{
        border: "1px solid rgba(0,0,0,0.1)",
        borderRadius: 4,
        px: {
          xl: 8,
          lg: 6,
          md: 0
        },
        pt: 5,
        pb: 10,
        position: "relative"
      }}
    >
      <PersonHeadInfo person={person} />
      {children}
      {canUpdate && <PersonDetailAction handleReset={handleReset} handleSave={handleSave} />}
    </Box>
  );
}

PersonDetailWrapper.defaultProps = {
  canUpdate: false,
  handleReset: undefined,
  handleSave: undefined
};

PersonDetailWrapper.propTypes = {
  person: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  canUpdate: PropTypes.bool,
  handleReset: PropTypes.func,
  handleSave: PropTypes.func
};

export default PersonDetailWrapper;
