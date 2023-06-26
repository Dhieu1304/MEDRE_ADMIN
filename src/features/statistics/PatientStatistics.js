import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

import CustomOverlay from "../../components/CustomOverlay/CustomOverlay";
import CustomPageTitle from "../../components/CustomPageTitle";
import { useFetchingStore } from "../../store/FetchingApiStore";
import statisticsServices from "../../services/statisticsServices";
import LineChart from "./components/LineChart";
import StatisticsFilter, { statisticsFilterTypes } from "./components/StatisticsFilter";

function PatientStatistics() {
  const [time, setTime] = useState(statisticsFilterTypes.DAY);
  const [data, setData] = useState([]);

  const { t } = useTranslation("statisticsFeature", { keyPrefix: "PatientStatistics" });

  const { isLoading, fetchApi } = useFetchingStore();

  const loadData = async (timeLoad) => {
    await fetchApi(async () => {
      const res = await statisticsServices.getStatisticsByPatient({ time: timeLoad });
      setData([...res.data]);
      return { ...res };
    });
  };

  useEffect(() => {
    loadData(time);
  }, [time]);

  return (
    <>
      <CustomOverlay open={isLoading} />
      <Box>
        <CustomPageTitle title={t("title")} right={<StatisticsFilter time={time} setTime={setTime} />} />
        <Box
          sx={{
            maxWidth: "100%",
            overflow: "scroll"
          }}
        >
          <Box
            sx={{
              px: 10
            }}
          >
            <LineChart data={data} />
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default PatientStatistics;
