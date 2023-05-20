import PropTypes from "prop-types";
import { RestartAlt as RestartAltIcon, Save as SaveIcon } from "@mui/icons-material";
import { Box, Button, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

function PersonDetailAction({ handleReset, handleSave }) {
  const theme = useTheme();
  const { t } = useTranslation("components", { keyPrefix: "PersonDetailWrapper.PersonDetailAction" });

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end"
      }}
    >
      <Button
        variant="contained"
        onClick={handleReset}
        sx={{
          ml: 2,
          bgcolor: theme.palette.warning.light
        }}
        startIcon={<RestartAltIcon color={theme.palette.warning.contrastText} />}
      >
        {t("button.reset")}
      </Button>

      <Button
        variant="contained"
        onClick={handleSave}
        sx={{
          ml: 2,
          bgcolor: theme.palette.success.light
        }}
        startIcon={<SaveIcon color={theme.palette.success.contrastText} />}
      >
        {t("button.save")}
      </Button>
    </Box>
  );
}

PersonDetailAction.defaultProps = {
  handleReset: undefined,
  handleSave: undefined
};

PersonDetailAction.propTypes = {
  handleReset: PropTypes.func,
  handleSave: PropTypes.func
};

export default PersonDetailAction;
