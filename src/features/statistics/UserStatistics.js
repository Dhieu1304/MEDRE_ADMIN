import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import CustomOverlay from "../../components/CustomOverlay/CustomOverlay";
import CustomPageTitle from "../../components/CustomPageTitle";
import { useFetchingStore } from "../../store/FetchingApiStore";

function UserStatistics() {
  const { t } = useTranslation("statisticsFeature", { keyPrefix: "UserStatistics" });

  const { isLoading } = useFetchingStore();

  return (
    <>
      <CustomOverlay open={isLoading} />
      <Box>
        <CustomPageTitle title={t("title")} />
      </Box>
    </>
  );
}

export default UserStatistics;
