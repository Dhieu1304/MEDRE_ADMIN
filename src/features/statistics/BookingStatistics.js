import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import CustomOverlay from "../../components/CustomOverlay/CustomOverlay";
import CustomPageTitle from "../../components/CustomPageTitle";
import { useFetchingStore } from "../../store/FetchingApiStore";
import StatisticsFilter, { statisticsFilterTypes } from "./components/StatisticsFilter";

function BookingStatistics() {
  const [type, setType] = useState(statisticsFilterTypes.DATE);

  const { t } = useTranslation("statisticsFeature", { keyPrefix: "BookingStatistics" });

  const { isLoading } = useFetchingStore();

  return (
    <>
      <CustomOverlay open={isLoading} />
      <Box>
        <CustomPageTitle title={t("title")} right={<StatisticsFilter type={type} setType={setType} />} />
      </Box>
    </>
  );
}

export default BookingStatistics;
