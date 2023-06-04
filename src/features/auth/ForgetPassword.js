import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useFetchingStore } from "../../store/FetchingApiStore";
import authServices from "../../services/authServices";
import CustomOverlay from "../../components/CustomOverlay/CustomOverlay";
import VerificationForm from "../verification/components/VerificationForm/VerificationForm";

function Verification() {
  const { isLoading, fetchApi } = useFetchingStore();

  const { t } = useTranslation("authFeature", { keyPrefix: "ForgotPassword" });

  const sendVerificationOtpToPhone = async (phoneNumber) => {
    // return await fetchApi(async () => {
    return fetchApi(async () => {
      const res = await authServices.sendResetPasswordOtpToPhone(phoneNumber);
      return { ...res };
    });
  };

  const sendVerificationToEmail = async (email) => {
    // return await fetchApi(async () => {
    return fetchApi(async () => {
      const res = await authServices.sendResetPasswordToEmail(email);
      return { ...res };
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        px: 2
      }}
    >
      <CustomOverlay open={isLoading} />
      <Typography
        variant="h5"
        sx={{
          fontSize: 30,
          fontWeight: 600
        }}
      >
        {t("title")}
      </Typography>
      <VerificationForm
        sendVerificationOtpToPhone={sendVerificationOtpToPhone}
        sendVerificationToEmail={sendVerificationToEmail}
      />
    </Box>
  );
}

export default Verification;
