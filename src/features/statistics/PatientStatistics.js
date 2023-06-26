import { Box, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";

import CustomOverlay from "../../components/CustomOverlay/CustomOverlay";
import CustomPageTitle from "../../components/CustomPageTitle";
import { useFetchingStore } from "../../store/FetchingApiStore";
import statisticsServices from "../../services/statisticsServices";
import LineChart from "./components/LineChart";

export const statisticsFilterTypes = {
  DAY: "Day",
  WEEK: "Week",
  MONTH: "Month",
  YEAR: "Year"
};

function PatientStatistics() {
  const [dayData, setDayData] = useState([]);
  const [weekData, setWeekData] = useState([]);
  const [monthData, setMonthData] = useState([]);
  const [yearData, setYearData] = useState([]);

  const data = useMemo(() => {
    return [dayData, weekData, monthData, yearData];
  }, [dayData, weekData, monthData, yearData]);

  const { t } = useTranslation("statisticsFeature", { keyPrefix: "PatientStatistics" });

  const { isLoading, fetchApi } = useFetchingStore();

  const loadData = async () => {
    await fetchApi(async () => {
      const res = await statisticsServices.getStatisticsByPatient({ time: statisticsFilterTypes.DAY });
      setDayData([...res.data]);
      return { ...res };
    });

    await fetchApi(async () => {
      const res = await statisticsServices.getStatisticsByPatient({ time: statisticsFilterTypes.WEEK });
      setWeekData([...res.data]);
      return { ...res };
    });

    await fetchApi(async () => {
      const res = await statisticsServices.getStatisticsByPatient({ time: statisticsFilterTypes.MONTH });
      setMonthData([...res.data]);
      return { ...res };
    });

    await fetchApi(async () => {
      const res = await statisticsServices.getStatisticsByPatient({ time: statisticsFilterTypes.YEAR });
      setYearData([...res.data]);
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

export default PatientStatistics;
