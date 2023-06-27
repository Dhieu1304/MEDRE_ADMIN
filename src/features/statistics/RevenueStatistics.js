import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

import CustomOverlay from "../../components/CustomOverlay/CustomOverlay";
import CustomPageTitle from "../../components/CustomPageTitle";
import { useFetchingStore } from "../../store/FetchingApiStore";
import statisticsServices from "../../services/statisticsServices";
import LineChart from "./components/LineChart";
import StatisticsFilter, { statisticsFilterTypes } from "./components/StatisticsFilter";
import { scheduleTypes } from "../../entities/Schedule/constant";

function RevenueStatistics() {
  const [time, setTime] = useState(statisticsFilterTypes.DAY);
  const [dataOnline, setDataOnline] = useState([]);
  const [dataOffline, setDataOffline] = useState([]);


  const { t } = useTranslation("statisticsFeature", { keyPrefix: "RevenueStatistics" });

  const { isLoading, fetchApi } = useFetchingStore();

  const loadData = async (timeLoad) => {
    await fetchApi(async () => {
      const res = await statisticsServices.getStatisticsByRevenue({ time: timeLoad, type: scheduleTypes.TYPE_OFFLINE });
      setDataOffline([...res.data]);
      return { ...res };
    });

    await fetchApi(async () => {
      const res = await statisticsServices.getStatisticsByRevenue({ time: timeLoad, type: scheduleTypes.TYPE_ONLINE });
      setDataOnline([...res.data]);
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
            <LineChart data={dataOffline} />
          </Box>
          <Box
            sx={{
              px: 10
            }}
          >
            <LineChart data={dataOnline} />
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default RevenueStatistics;
