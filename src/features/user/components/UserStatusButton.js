import PropTypes from "prop-types";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Lock as LockIcon, LockOpen as LockOpenIcon } from "@mui/icons-material";
import { userStatuses } from "../../../entities/User";

const { STATUS_BLOCK, STATUS_UNBLOCK } = userStatuses;

const UserStatusButton = ({ variant, onClick, isLabel }) => {
  const { t: tStatus } = useTranslation("userEntity", { keyPrefix: "constants.statuses" });

  const theme = useTheme();

  const render = () => {
    let title = "";
    let color = "";
    let bgcolor = "";
    let icon = "";

    switch (variant) {
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
        {isLabel ? (
          <Typography
            sx={{
              color: bgcolor,
              bgcolor: color,
              // maxWidth: 12
              fontSize: 14,
              display: "flex",
              alignItems: "center"
            }}
          >
            <Box
              component="span"
              sx={{
                mr: 1
              }}
            >
              {icon}
            </Box>
            {title}
          </Typography>
        ) : (
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
        )}
      </Box>
    );
  };

  return render();
};

UserStatusButton.defaultProps = {
  isLabel: undefined
};

UserStatusButton.propTypes = {
  variant: PropTypes.oneOf([STATUS_UNBLOCK, STATUS_BLOCK]).isRequired,
  isLabel: PropTypes.bool,
  onClick: PropTypes.func.isRequired
};

export default UserStatusButton;
