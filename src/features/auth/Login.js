import { Box, Typography, Button, useTheme } from "@mui/material";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import routeConfig from "../../config/routeConfig";
import { useAuthStore } from "../../store/AuthStore";
import CustomInput from "../../components/CustomInput";
import { useFetchingStore } from "../../store/FetchingApiStore";
import CustomOverlay from "../../components/CustomOverlay/CustomOverlay";

export default function Login() {
  const { handleSubmit, control, trigger } = useForm({
    mode: "onChange",
    defaultValues: {
      emailOrUsernameOrPhoneNumber: "",
      password: ""
    },
    criteriaMode: "all"
  });

  const authStore = useAuthStore();
  const navigate = useNavigate();
  const theme = useTheme();
  const { isLoading } = useFetchingStore();

  const { t } = useTranslation("authFeature", { keyPrefix: "Login" });
  const { t: tStaff } = useTranslation("staffEntity", { keyPrefix: "properties" });
  const { t: tInputValidation } = useTranslation("input", { keyPrefix: "validation" });

  const onLogin = async ({ emailOrUsernameOrPhoneNumber, password }) => {
    const res = await authStore.login(emailOrUsernameOrPhoneNumber, password);

    // console.log("res: ", res);

    toast(res?.message);
    if (res?.success) {
      navigate(routeConfig.home);
    }
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
    </>
  );
}
