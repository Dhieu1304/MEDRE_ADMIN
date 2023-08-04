import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useFetchingStore } from "../../store/FetchingApiStore";
import authServices from "../../services/authServices";
import CustomOverlay from "../../components/CustomOverlay/CustomOverlay";
import VerificationForm from "./components/VerificationForm/VerificationForm";

function Verification() {
  const { isLoading, fetchApi } = useFetchingStore();

  const { t } = useTranslation("verificationFeature", { keyPrefix: "Verification" });

  const sendVerificationOtpToPhone = async (phoneNumber) => {
    // return await fetchApi(async () => {
    return fetchApi(async () => {
      const res = await authServices.sendVerificationOtpToPhone(phoneNumber);
      return { ...res };
    });
  };

  const sendVerificationToEmail = async (email) => {
    // return await fetchApi(async () => {
    return fetchApi(async () => {
      const res = await authServices.sendVerificationToEmail(email);
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
        px: 4
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
