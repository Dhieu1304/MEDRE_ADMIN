import { Box, Typography, Button, useTheme } from "@mui/material";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/AuthStore";
import CustomInput from "../../components/CustomInput";
import { useFetchingStore } from "../../store/FetchingApiStore";
import CustomOverlay from "../../components/CustomOverlay/CustomOverlay";
import routeConfig from "../../config/routeConfig";
import { authRoutes } from "../../pages/AuthPage/routes";

export default function Login() {
  const { handleSubmit, control, trigger, watch } = useForm({
    mode: "onChange",
    defaultValues: {
      emailOrUsernameOrPhoneNumber: "",
      password: ""
    },
    criteriaMode: "all"
  });

  const authStore = useAuthStore();
  const theme = useTheme();
  const { isLoading } = useFetchingStore();

  const { t } = useTranslation("authFeature", { keyPrefix: "Login" });
  const { t: tStaff } = useTranslation("staffEntity", { keyPrefix: "properties" });
  const { t: tInputValidation } = useTranslation("input", { keyPrefix: "validation" });

  const onLogin = async ({ emailOrUsernameOrPhoneNumber, password }) => {
    const res = await authStore.login(emailOrUsernameOrPhoneNumber, password);
    toast(res?.message);

    // Sau khi login thì tự động navigate sang home nên ko cần tự nưa.

    // if (res?.success) {
    //   navigate(routeConfig.home);
    // }
  };

  return (
    <>
      <CustomOverlay open={isLoading || authStore.isLoading} />
      <Typography component="h1" variant="h5">
        {t("title")}
      </Typography>
      <Box component="form" noValidate onSubmit={handleSubmit(onLogin)} sx={{ marginTop: 2, width: 500 }}>
        <Box
          sx={{
            mb: 2,
            width: "100%"
          }}
        >
          <CustomInput
            control={control}
            rules={{
              required: tInputValidation("required")
            }}
            label={tStaff("emailOrUsernameOrPhoneNumber")}
            trigger={trigger}
            name="emailOrUsernameOrPhoneNumber"
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
              required: tInputValidation("required")
            }}
            label={tStaff("password")}
            trigger={trigger}
            name="password"
            type="password"
          />
        </Box>

        {authStore.isFetchApiError && (
          <Typography
            sx={{
              mb: 2,
              color: theme.palette.error.light
            }}
          >
            {authStore.fetchApiError}
          </Typography>
        )}

        <Button type="submit" fullWidth variant="contained" sx={{ mb: 2, p: 1, fontSize: 10 }}>
          {t("button.login")}
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: 500
        }}
      >
        <Box
          component={Link}
          sx={{ color: "blue", textDecoration: "none" }}
          to={routeConfig.auth + authRoutes.forgetPassword}
          state={{
            phoneNumberOrEmail: watch().phoneNumberOrEmail,
            isFinishSendInfoStep: false
          }}
        >
          {t("link.forgotPassword")}
        </Box>
        <Box
          component={Link}
          sx={{
            color: "blue",
            textDecoration: "none",
            ml: {
              sm: 2,
              xs: 0
            }
          }}
          to={routeConfig.verification}
          state={{
            phoneNumberOrEmail: watch().phoneNumberOrEmail,
            isFinishSendInfoStep: false
          }}
        >
          {t("link.verification")}
        </Box>
      </Box>
    </>
  );
}
