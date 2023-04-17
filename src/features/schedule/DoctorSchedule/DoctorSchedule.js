import PropTypes from "prop-types";
import { Add as AddIcon, ArrowLeft as ArrowLeftIcon, ArrowRight as ArrowRightIcon } from "@mui/icons-material";
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

import CustomOverlay from "../../../components/CustomOverlay";

import scheduleServices from "../../../services/scheduleServices";
import { useFetchingStore } from "../../../store/FetchingApiStore";
import { getWeekByDate } from "../../../utils/datetimeUtil";
import WithTimesLoaderWrapper from "../hocs/WithTimesLoaderWrapper";
import WithDoctorLoaderWrapper from "../../staff/components/WithDoctorLoaderWrapper";
import timeOffServices from "../../../services/timeOffServices";
import { useCustomModal } from "../../../components/CustomModal";
import AddNewTimeOffModal from "../components/AddNewTimeOffModal";
import { findBookingsByDate, groupSchedulesByTimeId } from "./utils";

function DoctorSchedule({ timesList, doctor }) {
  const [schedules, setSchedules] = useState([]);
  const [timeOffs, setTimeOffs] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const params = useParams();
  const { staffId } = params;

  const theme = useTheme();

  const { isLoading, fetchApi } = useFetchingStore();

  const addTimeOffModal = useCustomModal();

  const { t } = useTranslation("scheduleFeature", { keyPrefix: "DoctorSchedule" });

  const heads = useMemo(() => getWeekByDate(currentDate), [currentDate]);

  const loadData = async () => {
    await fetchApi(async () => {
      const res = await scheduleServices.getScheduleListByDoctorId(staffId, heads[0], heads[6]);

      if (res.success) {
        const schedulesData = res.schedules;
        setSchedules(schedulesData);
        return { success: true, error: "" };
      }
      setSchedules([]);
      return { success: false, error: res.message };
    });
  };

  const loadTimeOffs = async () => {
    await fetchApi(async () => {
      const res = await timeOffServices.getTimeOffByDoctorId(staffId, { from: heads[0], to: heads[6] });

      if (res.success) {
        const timeOffsData = res.timeOffs;
        setTimeOffs(timeOffsData);
        return { success: true, error: "" };
      }
      setTimeOffs([]);
      return { success: false, error: res.message };
    });
  };

  useEffect(() => {
    loadData();
  }, [heads]);

  useEffect(() => {
    loadTimeOffs();
  }, [heads]);

  const rows = useMemo(() => {
    return groupSchedulesByTimeId(schedules, timesList, heads, timeOffs);
  }, [heads, schedules, timesList, timeOffs]);

  // return <div>sang</div>;

  const renderCell = (schedule, colDate, time, index) => {
    const booking = findBookingsByDate(schedule?.bookings, colDate);
    const scheduleStartTime = time.timeStart;
    const scheduleEndTime = time.timeEnd;
    const scheduleStartTimeStr = `${formatDate.format(colDate, "YYYY-MM-DD")} ${scheduleStartTime}`;
    const scheduleEndTimeStr = `${formatDate.format(colDate, "YYYY-MM-DD")} ${scheduleEndTime}`;

    const isTimeOff = schedule?.isTimeOff;
    const now = new Date();

    const isOutOfTime = formatDate.subtract(now, new Date(scheduleStartTimeStr)).toMilliseconds() > 0;
    const isCurrentTime =
      formatDate.subtract(now, new Date(scheduleStartTimeStr)).toMilliseconds() > 0 &&
      formatDate.subtract(now, new Date(scheduleEndTimeStr)).toMilliseconds() < 0;

    return (
      <TableCell
        key={index}
        sx={{
          border: "1px solid rgba(0,0,0,0.4)",
          p: 0,
          position: "relative"
        }}
        align="center"
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            minHeight: 75,
            position: "relative"
          }}
        >
          {schedule && (
            <>
              <Box
                sx={{
                  width: "100%",
                  backgroundColor: schedule?.type === "Online" ? "#009ACD" : "#00CDCD",
                  color: theme.palette.info.contrastText,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                {schedule && <Typography sx={{}}>{schedule?.type}</Typography>}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexGrow: 1,
                  bgcolor: isCurrentTime ? theme.palette.info.light : booking && theme.palette.success.light,
                  // bgcolor: isCurrentTime ? "red" : "inherit",
                  position: "relative"
                }}
              >
                <Typography
                  sx={{
                    // marginTop: "20px",
                    textAlign: "center",
                    fontWeight: "bold",
                    py: 1,
                    color: isCurrentTime ? theme.palette.info.contrastText : theme.palette.success.contrastText
                  }}
                >
                  {booking ? "Booked" : ""}
                </Typography>

                {isTimeOff && (
                  <Box
                    sx={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      top: 0,
                      left: 0,
                      zIndex: 1,
                      bgcolor: "rgba(255, 246, 143, 0.8)"
                    }}
                  />
                )}
              </Box>
            </>
          )}
        </Box>

        {!isCurrentTime && isOutOfTime && (
          <Box
            sx={{
              position: "absolute",
              width: "100%",
              height: "100%",
              top: 0,
              left: 0,
              zIndex: 1,
              bgcolor: "rgba(204,204,204,0.6)"
            }}
          />
        )}
      </TableCell>
    );
  };

  const renderCols = (row, time) => {
    const scheduleIdsByDayOfWeek = row.reduce((acc, schedule) => {
      acc[schedule.dayOfWeek] = schedule;
      return acc;
    }, {});

    const cols = Array.from({ length: 7 }, (_, index) => {
      const schedule = scheduleIdsByDayOfWeek[index];

      const colDate = heads[index];

      return renderCell(schedule, colDate, time, index);
    });

    return cols;
  };

  const handleAfterAddTimeOff = async () => {
    await loadTimeOffs();
  };

  return (
    <>
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
            <Button
              variant="contained"
              onClick={() => {
                addTimeOffModal.setShow(true);
                addTimeOffModal.setData(doctor);
              }}
              endIcon={<AddIcon fontSize="large" />}
              sx={{
                bgcolor: theme.palette.success.light
              }}
            >
              {t("button.addTimeOff")}
            </Button>
            <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", mx: 2 }}>
              {formatDate.format(heads[0], "DD/MM/YYYY")} - {formatDate.format(heads[6], "DD/MM/YYYY")}
            </Box>
            <IconButton
              onClick={() => {
                const newCurrentDate = new Date(currentDate);
                newCurrentDate.setDate(newCurrentDate.getDate() - 7);
                // console.log("prev newCurrentDate: ", newCurrentDate);
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
              {t("button.currentWeek")}
            </Button>
            <IconButton
              onClick={() => {
                const newCurrentDate = new Date(currentDate);
                newCurrentDate.setDate(newCurrentDate.getDate() + 7);
                // console.log("next newCurrentDate: ", newCurrentDate);
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
              {rows?.map((row, index) => {
                return (
                  <TableRow
                    key={timesList[index]?.id}
                    // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell
                      sx={{
                        border: "1px solid rgba(0,0,0,0.2)",
                        fontWeight: "600",
                        width: 120
                      }}
                      component="th"
                      scope="row"
                    >
                      {/* {row?.timeStart} - {row?.timeEnd} */}
                      {`${timesList[index]?.timeStart?.split(":")[0]}:${timesList[index]?.timeStart?.split(":")[1]}`} -{" "}
                      {`${timesList[index]?.timeEnd?.split(":")[0]}:${timesList[index]?.timeEnd?.split(":")[1]}`}
                    </TableCell>

                    {renderCols(row, timesList[index])}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {addTimeOffModal.show && (
        <AddNewTimeOffModal
          show={addTimeOffModal.show}
          setShow={addTimeOffModal.setShow}
          data={addTimeOffModal.data}
          setData={addTimeOffModal.setData}
          handleAfterAddTimeOff={handleAfterAddTimeOff}
        />
      )}
    </>
  );
}

DoctorSchedule.propTypes = {
  timesList: PropTypes.array.isRequired,
  doctor: PropTypes.object.isRequired
};

export default WithTimesLoaderWrapper(WithDoctorLoaderWrapper(DoctorSchedule));