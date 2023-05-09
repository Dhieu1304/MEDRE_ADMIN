import PropTypes from "prop-types";
import { Box, Button, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Lock as LockIcon, LockOpen as LockOpenIcon } from "@mui/icons-material";
import { staffRoles, staffStatuses } from "../../../entities/Staff";

const { ROLE_ADMIN, ROLE_DOCTOR, ROLE_NURSE, ROLE_CUSTOMER_SERVICE } = staffRoles;
const { STATUS_BLOCK, STATUS_UNBLOCK } = staffStatuses;

const StaffRoleStatusButton = ({ variant, onClick }) => {
  const { t: tRole } = useTranslation("staffEntity", { keyPrefix: "constants.roles" });
  const { t: tStatus } = useTranslation("staffEntity", { keyPrefix: "constants.statuses" });

  const theme = useTheme();

  const render = () => {
    let title = "";
    let color = "";
    let bgcolor = "";
    let icon = "";

    switch (variant) {
      case ROLE_ADMIN:
        title = tRole("admin");
        bgcolor = theme.palette.success.light;
        color = theme.palette.success.contrastText;
        break;
      case ROLE_DOCTOR:
        title = tRole("doctor");
        bgcolor = theme.palette.primary.light;
        color = theme.palette.primary.contrastText;
        break;
      case ROLE_NURSE:
        title = tRole("nurse");
        bgcolor = theme.palette.warning.light;
        color = theme.palette.warning.contrastText;
        break;
      case ROLE_CUSTOMER_SERVICE:
        title = tRole("customerService");
        bgcolor = theme.palette.secondary.light;
        color = theme.palette.secondary.contrastText;
        break;

      case STATUS_UNBLOCK:
        title = tStatus("unblock");
        bgcolor = theme.palette.success.light;
        color = theme.palette.success.contrastText;
        icon = <LockOpenIcon />;
        break;

      case STATUS_BLOCK:
        title = tStatus("block");
        bgcolor = theme.palette.error.light;
        color = theme.palette.error.contrastText;
        icon = <LockIcon />;
        break;

      default:
        return <div />;
    }

    return (
      <Box>
        <Button
          variant="contained"
          onClick={onClick}
          size="small"
          sx={{
            color,
            bgcolor,
            // maxWidth: 12
            fontSize: "0.8em"
          }}
          endIcon={icon}
        >
          {title}
        </Button>
      </Box>
    );
  };

  return render();
};

// StaffRoleStatusButton.defaultProps = {};

StaffRoleStatusButton.propTypes = {
  variant: PropTypes.oneOf([ROLE_ADMIN, ROLE_DOCTOR, ROLE_NURSE, ROLE_CUSTOMER_SERVICE, STATUS_UNBLOCK, STATUS_BLOCK])
    .isRequired,

  onClick: PropTypes.func.isRequired
};

export default StaffRoleStatusButton;
