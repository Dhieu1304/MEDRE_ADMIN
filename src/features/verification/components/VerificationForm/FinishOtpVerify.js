import React from "react";
import { useTranslation } from "react-i18next";
// import PropTypes from "prop-types";
import { Box, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import routeConfig from "../../../../config/routeConfig";
import { authRoutes } from "../../../../pages/AuthPage/routes";
import { useAuthStore } from "../../../../store/AuthStore/hooks";

function FinishOtpVerify() {
  const { t } = useTranslation("verificationFeature", { keyPrefix: "VerificationForm.FinishOtpVerify" });
  const authStore = useAuthStore();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        p: 2
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontSize: 25,
          mb: 2
        }}
      >
        {t("title")}
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        {t("subTitle.congratulation")}
      </Typography>

      {!authStore?.isLogin && (
        <Grid container flexDirection="row" justifyContent="space-between">
          <Grid item>
            <Link to={routeConfig.auth + authRoutes.login}>
              <Box component="span" sx={{ color: "blue" }}>
                {t("link.signIn")}
              </Box>
            </Link>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default FinishOtpVerify;
