import { Box, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";

import CustomOverlay from "../../components/CustomOverlay/CustomOverlay";
import CustomPageTitle from "../../components/CustomPageTitle";
import { useFetchingStore } from "../../store/FetchingApiStore";
import statisticsServices from "../../services/statisticsServices";
import LineChart from "./components/LineChart";
import { scheduleTypes } from "../../entities/Schedule/constant";

export const statisticsFilterTypes = {
  DAY: "Day",
  WEEK: "Week",
  MONTH: "Month",
  YEAR: "Year"
};

function RevenueStatistics() {
  const [dayDataOffline, setDayDataOffline] = useState([]);
  const [weekDataOffline, setWeekDataOffline] = useState([]);
  const [monthDataOffline, setMonthDataOffline] = useState([]);
  const [yearDataOffline, setYearDataOffline] = useState([]);

  const [dayDataOnline, setDayDataOnline] = useState([]);
  const [weekDataOnline, setWeekDataOnline] = useState([]);
  const [monthDataOnline, setMonthDataOnline] = useState([]);
  const [yearDataOnline, setYearDataOnline] = useState([]);

  const data = useMemo(() => {
    return [
      dayDataOffline,
      weekDataOffline,
      monthDataOffline,
      yearDataOffline,
      dayDataOnline,
      weekDataOnline,
      monthDataOnline,
      yearDataOnline
    ];
  }, [
    dayDataOffline,
    weekDataOffline,
    monthDataOffline,
    yearDataOffline,
    dayDataOnline,
    weekDataOnline,
    monthDataOnline,
    yearDataOnline
  ]);

  const { t } = useTranslation("statisticsFeature", { keyPrefix: "RevenueStatistics" });

  const { isLoading, fetchApi } = useFetchingStore();

  const loadData = async () => {
    await fetchApi(async () => {
      const type = scheduleTypes.TYPE_OFFLINE;
      const res = await statisticsServices.getStatisticsByRevenue({ time: statisticsFilterTypes.DAY, type });
      setDayDataOffline([...res.data]);
      return { ...res };
    });
    await fetchApi(async () => {
      const type = scheduleTypes.TYPE_ONLINE;
      const res = await statisticsServices.getStatisticsByRevenue({ time: statisticsFilterTypes.DAY, type });
      setDayDataOnline([...res.data]);
      return { ...res };
    });

    await fetchApi(async () => {
      const type = scheduleTypes.TYPE_OFFLINE;
      const res = await statisticsServices.getStatisticsByRevenue({ time: statisticsFilterTypes.WEEK, type });
      setWeekDataOffline([...res.data]);
      return { ...res };
    });
    await fetchApi(async () => {
      const type = scheduleTypes.TYPE_ONLINE;
      const res = await statisticsServices.getStatisticsByRevenue({ time: statisticsFilterTypes.WEEK, type });
      setWeekDataOnline([...res.data]);
      return { ...res };
    });

    await fetchApi(async () => {
      const type = scheduleTypes.TYPE_OFFLINE;
      const res = await statisticsServices.getStatisticsByRevenue({ time: statisticsFilterTypes.MONT, type });
      setMonthDataOffline([...res.data]);
      return { ...res };
    });
    await fetchApi(async () => {
      const type = scheduleTypes.TYPE_ONLINE;
      const res = await statisticsServices.getStatisticsByRevenue({ time: statisticsFilterTypes.MONT, type });
      setMonthDataOnline([...res.data]);
      return { ...res };
    });

    await fetchApi(async () => {
      const type = scheduleTypes.TYPE_OFFLINE;
      const res = await statisticsServices.getStatisticsByRevenue({ time: statisticsFilterTypes.YEAR, type });
      setYearDataOffline([...res.data]);
      return { ...res };
    });
    await fetchApi(async () => {
      const type = scheduleTypes.TYPE_ONLINE;
      const res = await statisticsServices.getStatisticsByRevenue({ time: statisticsFilterTypes.YEAR, type });
      setYearDataOnline([...res.data]);
      return { ...res };
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <CustomOverlay open={isLoading} />
      <Box>
        <CustomPageTitle title={t("title")} />
        <Box
          sx={{
            maxWidth: "100%",
            overflow: "scroll"
          }}
        >
          <Grid container>
            {data.map((dataItem) => {
              return (
                <Grid item lg={6} xs={12}>
                  <Box
                    sx={{
                      px: 10
                    }}
                  >
                    <LineChart data={dataItem} />
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Box>
    </>
  );
}

export default RevenueStatistics;
