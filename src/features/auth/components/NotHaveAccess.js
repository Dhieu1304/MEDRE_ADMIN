import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

function NotHaveAccess() {
  const { t } = useTranslation("authFeature", { keyPrefix: "NoHaveAccess" });
  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Typography component="h1" fontWeight="700" fontSize={25}>
        {t("errorMessage")}
      </Typography>
    </Box>
  );
}

export default NotHaveAccess;
