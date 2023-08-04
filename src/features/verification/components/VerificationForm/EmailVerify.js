import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import routeConfig from "../../../../config/routeConfig";
import { authRoutes } from "../../../../pages/AuthPage/routes";
import { useAuthStore } from "../../../../store/AuthStore/hooks";

function EmailVerify({ backToFirstStep, resendVerification }) {
  const authStore = useAuthStore();

  const { t } = useTranslation("verificationFeature", { keyPrefix: "VerificationForm.EmailVerify" });

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
        {t("subTitle.askToCheckMail")}
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          flexWrap: "wrap"
        }}
      >
        {!authStore.isLogin && (
          <Box
            sx={{
              display: "flex",
              flexDirection: {
                sm: "row",
                xs: "column"
              },
              justifyContent: "space-between",
              mr: 2
            }}
          >
            <Box
              component={Link}
              to={routeConfig.auth + authRoutes.login}
              sx={{
                color: "blue",
                textDecoration: "none",
                cursor: "pointer",
                mr: {
                  sm: 2,
                  xs: 0
                }
              }}
            >
              {t("link.signIn")}
            </Box>
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            flexGrow: authStore.isLogin ? 1 : 0,
            flexDirection: {
              sm: "row",
              xs: authStore.isLogin ? "row" : "column"
            },
            justifyContent: "space-between"
          }}
        >
          <Box component="span" sx={{ color: "blue", textDecoration: "none", cursor: "pointer" }} onClick={backToFirstStep}>
            {t("link.back")}
          </Box>

          <Box
            component="span"
            sx={{
              color: "blue",
              textDecoration: "none",
              cursor: "pointer",
              ml: {
                sm: 2,
                xs: 0
              }
            }}
            onClick={resendVerification}
          >
            {t("link.resend")}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

EmailVerify.propTypes = {
  backToFirstStep: PropTypes.func.isRequired,
  resendVerification: PropTypes.func.isRequired
};

export default EmailVerify;
