import { Box, Typography, Button } from "@mui/material";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import routeConfig from "../../config/routeConfig";
import { useAuthStore } from "../../store/AuthStore";
import CustomInput from "../../components/CustomInput";
import { useAppConfigStore } from "../../store/AppConfigStore/hooks";

export default function Login() {
  const { handleSubmit, control, trigger } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "d.hieu.13.04@gmail.com",
      password: "dhieu1304"
    },
    criteriaMode: "all"
  });

  const authStore = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation("authFeature", { keyPrefix: "login" });

  const onLogin = async ({ email, password }) => {
    const result = await authStore.loginByEmail(email, password);
    if (result) {
      navigate(routeConfig.home);
    }
  };

  const { locale } = useAppConfigStore();
  const requireErrorMessage = useMemo(() => t("input.require_error_message"), [locale]);

  return (
    <>
      <Typography component="h1" variant="h5">
        {t("title")}
      </Typography>
      <Box component="form" noValidate onSubmit={handleSubmit(onLogin)} sx={{ marginTop: 1, width: 500 }}>
        <Box
          sx={{
            mb: 2,
            width: "100%"
          }}
        >
          <CustomInput
            control={control}
            rules={{
              required: requireErrorMessage
            }}
            label={t("input.email_label")}
            trigger={trigger}
            name="email"
            type="email"
          />
        </Box>

        <Box
          sx={{
            mb: 2,
            width: "100%"
          }}
        >
          <CustomInput
            control={control}
            rules={{
              required: requireErrorMessage
            }}
            label={t("input.password_label")}
            trigger={trigger}
            name="password"
            type="password"
          />
        </Box>

        <Button type="submit" fullWidth variant="contained" sx={{ mb: 2, p: 1, fontSize: 10 }}>
          {t("button_title")}
        </Button>
      </Box>
    </>
  );
}
