import { Button, Grid, Typography, Box } from "@mui/material";
import PropTypes from "prop-types";

import { useFormContext } from "react-hook-form";
import { Link } from "react-router-dom";

import { useTranslation } from "react-i18next";
import routeConfig from "../../../../config/routeConfig";
import { authRoutes } from "../../../../pages/AuthPage/routes";

import { useAuthStore } from "../../../../store/AuthStore/hooks";
import CustomInput from "../../../../components/CustomInput/CustomInput";
import patternConfig from "../../../../config/patternConfig";

function InfoForm({ handleSendVerification }) {
  const { handleSubmit, control, trigger } = useFormContext();

  const authStore = useAuthStore();

  const { t } = useTranslation("verificationFeature", { keyPrefix: "VerificationForm.InfoForm" });
  const { t: tStaff } = useTranslation("staffEntity", { keyPrefix: "properties" });
  const { t: tInputValidation } = useTranslation("input", { keyPrefix: "validation" });

  return (
    <Box
      sx={{
        minWidth: 250,
        width: "100%",
        // px: {
        //   sm: 4,
        //   xs: 0
        // },
        px: 2,
        display: "flex",
        flexDirection: "column"
      }}
    >
      <Typography
        component="h1"
        variant="h6"
        sx={{
          fontSize: 25,
          mb: 2,
          textAlign: "center"
        }}
      >
        {t("title")}
      </Typography>
      <Box component="form" noValidate onSubmit={handleSubmit(handleSendVerification)} sx={{ marginTop: 1 }}>
        <Box
          sx={{
            mb: 2
          }}
        >
          <CustomInput
            control={control}
            rules={{
              required: tInputValidation("required"),
              pattern: {
                value: patternConfig.phoneOrEmailPattern,
                message: tInputValidation("format")
              }
            }}
            label={tStaff("phoneNumberOrEmail")}
            trigger={trigger}
            name="phoneNumberOrEmail"
            type="text"
          />
        </Box>

        <Button type="submit" fullWidth variant="contained" sx={{ mb: 2, p: 1, fontSize: 10 }}>
          {t("button.send")}
        </Button>

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
    </Box>
  );
}

InfoForm.propTypes = {
  handleSendVerification: PropTypes.func.isRequired
};

export default InfoForm;
