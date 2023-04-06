import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

function NotHaveAccess() {
  const { t } = useTranslation("authFeature", { keyPrefix: "no_have_access" });
  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Typography component="h1" fontWeight="700">
        {t("error_message")}
      </Typography>
    </Box>
  );
}

export default NotHaveAccess;
