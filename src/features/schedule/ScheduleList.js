import { ArrowLeft as ArrowLeftIcon, ArrowRight as ArrowRightIcon } from "@mui/icons-material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  // useTheme,
  Box,
  Button,
  IconButton,
  // CardHeader,
  // Avatar,
  Typography
  // Card
} from "@mui/material";

import formatDate from "date-and-time";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import CustomOverlay from "../../components/CustomOverlay";
import scheduleServices from "../../services/scheduleServices";
import { useFetchingStore } from "../../store/FetchingApiStore";

function ScheduleList() {
  const [isFetchConfigSuccess, setIsFetchConfigSuccess] = useState(false);
  const [times, setTimes] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const [doctors, setDoctors] = useState([]);

  const { isLoading, fetchApi } = useFetchingStore();

  const { t } = useTranslation("scheduleFeature", { keyPrefix: "schedule_list" });

  const loadData = async () => {
    await fetchApi(async () => {
      // const res = await scheduleServices.getAllScheduleList(currentDate, currentDate);

      const res = {
        succes: false,
        messag: ""
      };

      // console.log("load data res: ", res);

      if (res.success) {
        const doctorsData = res.doctors;
        setDoctors(doctorsData);
        return { success: true, error: "" };
      }
      setDoctors([]);
      return { success: false, error: res.message };
    });
  };

  const rows = useMemo(() => {
    if (doctors.length <= 0) {
      return [];
    }

    const data = doctors?.map((doctor) => {
      return {
        ...doctor,
        schedules: doctor?.schedules?.reduce((result, schedule) => {
          return {
            ...result,
            [schedule?.idTime]: schedule
          };
        }, {})
      };
    });

    // console.log("data: ", data);

    return data;
  }, [doctors]);

  useEffect(() => {
    loadData();
  }, [currentDate]);

  const loadConfig = async () => {
    await fetchApi(async () => {
      const res = await scheduleServices.getTimeList();

      if (res.success) {
        setTimes(res.times);
        return { success: true, error: "" };
      }
      setTimes([]);
      return { success: false, error: res.message };
    });

    setIsFetchConfigSuccess(true);
  };

  useEffect(() => {
    loadConfig();
  }, []);

  return (
    isFetchConfigSuccess && (
      <Box>
        <CustomOverlay open={isLoading} />
        <Typography variant="h4" sx={{ mb: 4 }}>
          {t("title")}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", mb: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
              {formatDate.format(currentDate, "DD/MM/YYYY")}
            </Box>
            <IconButton
              onClick={() => {
                const newCurrentDate = new Date(currentDate);
                newCurrentDate.setDate(newCurrentDate.getDate() - 6);
                setCurrentDate(() => newCurrentDate);
              }}
            >
              <ArrowLeftIcon fontSize="large" />
            </IconButton>
            <Button
              variant="contained"
              onClick={() => {
                setCurrentDate(() => new Date());
              }}
              size="small"
            >
              {t("today")}
            </Button>
            <IconButton
              onClick={() => {
                const newCurrentDate = new Date(currentDate);
                newCurrentDate.setDate(newCurrentDate.getDate() + 6);
                setCurrentDate(() => newCurrentDate);
              }}
            >
              <ArrowRightIcon fontSize="large" />
            </IconButton>
          </Box>
        </Box>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    border: "1px solid rgba(0,0,0,0.2)"
                  }}
                />
                {times?.map((time) => {
                  return (
                    <TableCell
                      sx={{
                        border: "1px solid rgba(0,0,0,0.2)",
                        fontWeight: "600"
                      }}
                      key={time?.id}
                      align="center"
                    >
                      {time?.timeStart}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                return (
                  <TableRow key={row.id}>
                    <TableCell
                      sx={{
                        border: "1px solid rgba(0,0,0,0.2)",
                        fontWeight: "600"
                      }}
                      component="th"
                      scope="row"
                    >
                      {row?.name}
                    </TableCell>
                    {times?.map((time) => {
                      // console.log("time?.id: ", time?.id);
                      return (
                        <TableCell
                          key={time?.id}
                          sx={{
                            border: "1px solid rgba(0,0,0,0.2)"
                          }}
                          align="center"
                        >
                          {row?.schedules[time?.id]?.status}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    )
  );
}

export default ScheduleList;
