import { Button, Typography, Box, useTheme } from "@mui/material";
// import PropTypes from "prop-types";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";
// import routeConfig from "../../config/routeConfig";
// import authRoutes from "../../pages/AuthPage/routes";
// import { authRoutes } from "../../../config/routeConfig";

import CustomInput from "../../components/CustomInput/CustomInput";
import { userInputValidate } from "../../entities/User/constant";
import { useFetchingStore } from "../../store/FetchingApiStore/hooks";
import CustomOverlay from "../../components/CustomOverlay/CustomOverlay";
import routeConfig from "../../config/routeConfig";
import staffServices from "../../services/staffServices";

function ChangePassword() {
  const { handleSubmit, control, trigger, watch } = useForm({
    mode: "onChange",
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    },
    criteriaMode: "all"
  });

  const navigate = useNavigate();

  const theme = useTheme();

  const { t } = useTranslation("authFeature", { keyPrefix: "ChangePassword" });
  const { t: tStaff } = useTranslation("staffEntity", { keyPrefix: "properties" });
  const { t: tInputValidate } = useTranslation("input", { keyPrefix: "validation" });

  const { fetchApiError, isFetchApiError, fetchApi, isLoading } = useFetchingStore();

  const handleChangePassword = async ({ oldPassword, newPassword, confirmPassword }) => {
    // console.log({ oldPassword, newPassword, confirmPassword });

    await fetchApi(async () => {
      const res = await staffServices.changePassword({ oldPassword, newPassword, confirmPassword });
      // console.log("handle change pass: res: ", res);
      if (res?.success) {
        navigate(routeConfig.home);
        return { ...res };
      }
      return { ...res };
    });
  };

  return (
    <>
      <CustomOverlay open={isLoading} />

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
          variant="h2"
          sx={{
            fontSize: 25,
            fontWeight: 600,
            mb: 2,
            textAlign: "center"
          }}
        >
          {t("title")}
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit(handleChangePassword)} sx={{ marginTop: 1 }}>
          <Box
            sx={{
              mb: 2
            }}
          >
            <CustomInput
              control={control}
              rules={{
                required: tInputValidate("required")
              }}
              label={tStaff("oldPassword")}
              trigger={trigger}
              name="oldPassword"
              type="password"
            />
          </Box>

          <Box
            sx={{
              mb: 2
            }}
          >
            <CustomInput
              control={control}
              rules={{
                required: tInputValidate("required"),
                minLength: {
                  value: userInputValidate.PASSWORD_MIN_LENGTH,
                  message: tInputValidate("minLength", {
                    minLength: userInputValidate.PASSWORD_MIN_LENGTH
                  })
                },
                maxLength: {
                  value: userInputValidate.PASSWORD_MAX_LENGTH,
                  message: tInputValidate("maxLength", {
                    maxLength: userInputValidate.PASSWORD_MAX_LENGTH
                  })
                },
                pattern: {
                  value: /(?=.*[a-zA-Z])(?=.*[0-9])/,
                  message: tInputValidate("passwordFormat")
                }
              }}
              label={tStaff("newPassword")}
              trigger={trigger}
              triggerTo="confirmPassword"
              name="newPassword"
              type="password"
            />
          </Box>

          <Box
            sx={{
              mb: 2
            }}
          >
            <CustomInput
              control={control}
              rules={{
                required: tInputValidate("required"),
                validate: (value) =>
                  value === watch("newPassword") ||
                  tInputValidate("same", {
                    left: tStaff("confirmPassword"),
                    right: tStaff("newPassword")
                  })
              }}
              label={tStaff("confirmPassword")}
              trigger={trigger}
              name="confirmPassword"
              type="password"
              isCustomError
            />
          </Box>

          <Button type="submit" fullWidth variant="contained" sx={{ mb: 2, p: 1 }}>
            {t("button.save")}
          </Button>
          {isFetchApiError && (
            <Typography component="h3" color={theme.palette.error[theme.palette.mode]}>
              {fetchApiError}
            </Typography>
          )}
        </Box>
      </Box>
    </>
  );
}

// ChangePassword.propTypes = {
//   setStep: PropTypes.func.isRequired
// };

export default ChangePassword;
