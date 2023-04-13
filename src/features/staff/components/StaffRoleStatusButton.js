import PropTypes from "prop-types";
import { Box, Button, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
// import { Lock as LockIcon, LockOpen as LockOpenIcon } from "@mui/icons-material";
// import { staffRoles, staffStatus } from "../../../entities/Staff";

// const { ROLE_ADMIN, ROLE_DOCTOR, ROLE_NURSE, ROLE_CUSTOMER_SERVICE } = staffRoles;
// const { STATUS_BLOCK, STATUS_UNBLOCK } = staffStatus;

const StaffRoleStatusButton = ({ variant, onClick }) => {
  const { t: tRole } = useTranslation("staffFeature", { keyPrefix: "role" });
  // const { t: tStatus } = useTranslation("staffFeature", { keyPrefix: "status" });

  const theme = useTheme();

  const render = () => {
    let title = "";
    let color = "";
    let bgcolor = "";
    const icon = "";

    title = tRole("check");
    bgcolor = theme.palette.success.light;
    color = theme.palette.success.contrastText;
    switch (variant) {
      case "demo":
        title = tRole("admin");
        bgcolor = theme.palette.success.light;
        color = theme.palette.success.contrastText;
        break;
      // case ROLE_ADMIN:
      //   title = tRole("admin");
      //   bgcolor = theme.palette.success.light;
      //   color = theme.palette.success.contrastText;
      //   break;
      // case ROLE_DOCTOR:
      //   title = tRole("doctor");
      //   bgcolor = theme.palette.primary.light;
      //   color = theme.palette.primary.contrastText;
      //   break;
      // case ROLE_NURSE:
      //   title = tRole("nurse");
      //   bgcolor = theme.palette.warning.light;
      //   color = theme.palette.warning.contrastText;
      //   break;
      // case ROLE_CUSTOMER_SERVICE:
      //   title = tRole("customer_service");
      //   bgcolor = theme.palette.secondary.light;
      //   color = theme.palette.secondary.contrastText;
      //   break;

      // case STATUS_UNBLOCK:
      //   title = tStatus("ok");
      //   bgcolor = theme.palette.success.light;
      //   color = theme.palette.success.contrastText;
      //   icon = <LockOpenIcon />;
      //   break;

      // case STATUS_BLOCK:
      //   title = tStatus("block");
      //   bgcolor = theme.palette.error.light;
      //   color = theme.palette.error.contrastText;
      //   icon = <LockIcon />;
      //   break;

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
  // variant: PropTypes.oneOf([ROLE_ADMIN, ROLE_DOCTOR, ROLE_NURSE, ROLE_CUSTOMER_SERVICE, STATUS_UNBLOCK, STATUS_BLOCK])
  //   .isRequired,
  variant: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

export default StaffRoleStatusButton;
