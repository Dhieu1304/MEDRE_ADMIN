import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import qs from "query-string";

import { FormProvider, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import CustomOverlay from "../../components/CustomOverlay/CustomOverlay";
import CustomPageTitle from "../../components/CustomPageTitle";
import { useFetchingStore } from "../../store/FetchingApiStore";
import statisticsServices from "../../services/statisticsServices";
import LineChart from "./components/LineChart";
import StatisticsFilter from "./components/StatisticsFilter";
import ColumnChart from "./components/ColumnChart";
import StatisticsFilterForm from "./components/StatisticsFilterForm";
import useObjDebounce from "../../hooks/useObjDebounce";
import { useAppConfigStore } from "../../store/AppConfigStore";
import { useStatisticsTranslation } from "./hooks";
import { createDefaultValues, formatterStatisticsTime } from "./utils";

function UserStatistics() {
  const [data, setData] = useState([]);
  const location = useLocation();

  const defaultValues = useMemo(() => {
    const defaultSearchParams = qs.parse(location.search);
    const result = createDefaultValues(defaultSearchParams);
    return result;
  }, []);

  const filterForm = useForm({
    mode: "onChange",
    defaultValues,
    criteriaMode: "all"
  });

  const { watch, setValue } = filterForm;
  const navigate = useNavigate();
  const { t } = useTranslation("statisticsFeature", { keyPrefix: "UserStatistics" });

  const { isLoading, fetchApi } = useFetchingStore();
  const { from, to } = watch();
  const { locale } = useAppConfigStore();

  // delay 1000ms for selection and datetime
  const { debouncedObj: filterDebounce } = useObjDebounce({ from, to }, 1000);

  const [chartTitle, tableTitle] = useStatisticsTranslation(watch().time, t);
  const [series, categories, xLabel, yLabel] = useMemo(() => {
    const seriesData = [
      {
        name: t("chart.seriName.total"),
        data: data?.map((item) => parseInt(item.total, 10) || 0)
      }
    ];
    const categoriesData = data?.map((item) => {
      return item?.time ? formatterStatisticsTime(item.time, watch().time) : "";
    });
    const xLabelData = t("chart.xLabel");
    const yLabelData = t("chart.yLabel");

    return [seriesData, categoriesData, xLabelData, yLabelData];
  }, [data, locale]);

  const loadData = async () => {
    const params = { ...watch() };
    await fetchApi(async () => {
      const res = await statisticsServices.getStatisticsByUser(params);
      setData([...res.data]);
      return { ...res };
    });
  };

  useEffect(() => {
    loadData();
    const params = { ...watch() };
    const searchParams = qs.stringify(params);
    navigate(`?${searchParams}`);
  }, [watch().time, ...Object.values(filterDebounce)]);

  return (
    <>
      <CustomOverlay open={isLoading} />
      <Box>
        <CustomPageTitle
          title={t("title")}
          right={
            <StatisticsFilter
              time={watch().time}
              setTime={(time) => {
                setValue("time", time);
              }}
            />
          }
        />
        <Box>
          <FormProvider {...filterForm}>
            <StatisticsFilterForm />
          </FormProvider>
        </Box>
        <Box
          sx={{
            maxWidth: "100%"
          }}
        >
          <Grid container>
            <Grid
              item
              lg={8}
              xs={12}
              pr={{
                lg: 10,
                xs: 0
              }}
            >
              <LineChart title={chartTitle} series={series} categories={categories} xLabel={xLabel} yLabel={yLabel} />
              <ColumnChart title={chartTitle} series={series} categories={categories} xLabel={xLabel} yLabel={yLabel} />
            </Grid>
            <Grid item lg={4} xs={12}>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: 16,
                  mb: 2
                }}
              >
                {tableTitle}
              </Typography>
              <TableContainer component={Paper} sx={{ mb: 4 }}>
                <Table
                  sx={{
                    border: "1px #ccc solid"
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          width: 200
                        }}
                      >
                        <Typography variant="subtitle1">{t("table.col.time")}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ textAlign: "right" }} variant="subtitle1">
                          {t("table.col.total")}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data?.map((item) => {
                      return (
                        <TableRow key={item?.time}>
                          <TableCell>{formatterStatisticsTime(item?.time, watch().time)}</TableCell>
                          <TableCell sx={{ textAlign: "right" }}>{item?.total || 0}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}

export default UserStatistics;
