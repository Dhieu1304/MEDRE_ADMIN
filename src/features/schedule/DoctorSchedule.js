import { ArrowLeft as ArrowLeftIcon, ArrowRight as ArrowRightIcon } from "@mui/icons-material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  Box,
  Button,
  IconButton,
  CardHeader,
  Avatar,
  Typography,
  Card
} from "@mui/material";

import formatDate from "date-and-time";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import CustomOverlay from "../../components/CustomOverlay";

import scheduleServices from "../../services/scheduleServices";
import staffServices from "../../services/staffServices";
import { useFetchingStore } from "../../store/FetchingApiStore";
import { getWeekByDate, subtractDate } from "../../utils/datetimeUtil";
import ScheduleButton, { EMPTY } from "./components/ScheduleButton";

function DoctorSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [times, setTimes] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [doctor, setDoctor] = useState();

  const theme = useTheme();

  const [isFetchConfigSuccess, setIsFetchConfigSuccess] = useState(false);

  const { isLoading, fetchApi } = useFetchingStore();

  const params = useParams();

  const { t } = useTranslation("scheduleFeature", { keyPrefix: "doctorSchedule" });

  const renderCell = (cell) => {
    if (cell) {
      return <ScheduleButton variant={EMPTY} onClick={() => {}} />;
    }
    return <div />;
  };

  const heads = useMemo(() => getWeekByDate(currentDate), [currentDate]);
  // const rows = useMemo(() => createDatas(times, schedules, currentDate), [times, schedules, currentDate]);

  const loadData = async () => {
    await fetchApi(async () => {
      const res = await scheduleServices.getScheduleList(heads[0], heads[6]);

      if (res.success) {
        const schedulesData = res.schedules;
        setSchedules(schedulesData);
        return { success: true, error: "" };
      }
      setSchedules([]);
      return { success: false, error: res.message };
    });
  };

  useEffect(() => {
    loadData();
  }, [heads]);

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

    await fetchApi(async () => {
      const staffId = params?.staffId;
      const res = await staffServices.getStaffDetail(staffId);

      if (res.success) {
        setDoctor(res.staff);
        return { success: true, error: "" };
      }
      return { success: false, error: res.message };
    });

    setIsFetchConfigSuccess(true);
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const rows = useMemo(() => {
    if (times.length < 0) {
      return null;
    }

    const data = times.reduce((result, time) => {
      return {
        ...result,
        [time?.id]: {
          ...time,
          // schedules: [],
          day1: null,
          day2: null,
          day3: null,
          day4: null,
          day5: null,
          day6: null,
          day7: null
        }
      };
    }, {});

    schedules.forEach((schedule) => {
      const timeId = schedule.idTime;
      if (data[timeId] !== undefined) {
        // data[timeId].schedules.push(schedule);

        const firstDate = heads[0];
        const date = new Date(schedule?.date);
        const subtract = subtractDate(date, firstDate);

        switch (subtract) {
          case 0:
            data[timeId].day1 = schedule;
            break;
          case 1:
            data[timeId].day2 = schedule;
            break;
          case 2:
            data[timeId].day3 = schedule;
            break;
          case 3:
            data[timeId].day4 = schedule;
            break;
          case 4:
            data[timeId].day5 = schedule;
            break;
          case 5:
            data[timeId].day6 = schedule;
            break;
          case 6:
            data[timeId].day7 = schedule;
            break;
          default:
            break;
        }
      }
    });

    const result = Object.keys(data)
      .map((key) => {
        return data[key];
      })
      .sort((a, b) => {
        return a?.timeStart.localeCompare(b?.timeStart);
      });

    return result;
  }, [times, schedules]);

  return (
    isFetchConfigSuccess && (
      <Box>
        <CustomOverlay open={isLoading} />
        <Typography variant="h4" sx={{ mb: 4 }}>
          {t("title")}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Card
            sx={{
              height: "100%",
              maxWidth: 500,
              display: "flex",
              flexDirection: "column",
              p: 0,
              cursor: "pointer",
              border: "none",
              boxShadow: "none"
            }}
          >
            <CardHeader
              avatar={<Avatar alt={doctor?.name} src={doctor?.image} />}
              title={<Typography variant="h6">{doctor?.name}</Typography>}
              subheader={doctor?.certificate && `(${doctor?.certificate})`}
            />
          </Card>

          <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
              {formatDate.format(heads[0], "DD/MM")} - {formatDate.format(heads[6], "DD/MM")}
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
              {t("current_week")}
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
                {heads.map((cell) => {
                  const isToday = formatDate.isSameDay(new Date(), cell);
                  return (
                    <TableCell
                      sx={{
                        border: "1px solid rgba(0,0,0,0.2)",
                        fontWeight: "600",
                        backgroundColor: isToday && theme.palette.primary.main,
                        color: isToday && "white"
                      }}
                      key={cell}
                      align="center"
                    >
                      {formatDate.format(cell, "DD/MM")}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                return (
                  <TableRow key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell
                      sx={{
                        border: "1px solid rgba(0,0,0,0.2)",
                        fontWeight: "600"
                      }}
                      component="th"
                      scope="row"
                    >
                      {row.timeStart} - {row.timeEnd}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid rgba(0,0,0,0.2)"
                      }}
                      align="center"
                    >
                      {renderCell(row.day1)}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid rgba(0,0,0,0.2)"
                      }}
                      align="center"
                    >
                      {renderCell(row.day2)}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid rgba(0,0,0,0.2)"
                      }}
                      align="center"
                    >
                      {renderCell(row.day3)}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid rgba(0,0,0,0.2)"
                      }}
                      align="center"
                    >
                      {renderCell(row.day4)}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid rgba(0,0,0,0.2)"
                      }}
                      align="center"
                    >
                      {renderCell(row.day5)}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid rgba(0,0,0,0.2)"
                      }}
                      align="center"
                    >
                      {renderCell(row.day6)}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid rgba(0,0,0,0.2)"
                      }}
                      align="center"
                    >
                      {renderCell(row.day7)}
                    </TableCell>
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

export default DoctorSchedule;
