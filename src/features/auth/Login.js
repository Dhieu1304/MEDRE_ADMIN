import { Box, Typography, Button } from "@mui/material";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import routeConfig from "../../config/routeConfig";
import { useAuthStore } from "../../store/AuthStore";
import AuthInput from "./components/AuthInput";

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

  const requireErrorMessage = useMemo(() => t("input.require_error_message"), []);

  return (
    <>
      <Typography component="h1" variant="h5">
        {t("title")}
      </Typography>
      <Box component="form" noValidate onSubmit={handleSubmit(onLogin)} sx={{ marginTop: 1 }}>
        <AuthInput
          control={control}
          rules={{
            required: requireErrorMessage,
            // https://ihateregex.io/expr/phone/
            pattern: {
              value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
              message: t("input.email_format_error_message")
            }
          }}
          label={t("input.email_label")}
          trigger={trigger}
          name="email"
          type="email"
        />

        <AuthInput
          control={control}
          rules={{
            required: requireErrorMessage
            // minLength: {
            //   value: 8,
            //   message: t("input.password_min_length_error_message")
            // },
            // pattern: {
            //   value: /(?=.*[a-zA-Z])(?=.*[0-9])/,
            //   message: t("input.password_format_error_message")
            // }
          }}
          label={t("input.password_label")}
          trigger={trigger}
          name="password"
          type="password"
        />

        <Button type="submit" fullWidth variant="contained" sx={{ mb: 2, p: 1, fontSize: 10 }}>
          {t("button_title")}
        </Button>
      </Box>
    </>
  );
}
