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
import { useLocation, useNavigate, useParams } from "react-router-dom";
import qs from "query-string";

import CustomOverlay from "../../../components/CustomOverlay";

import scheduleServices from "../../../services/scheduleServices";
import { useFetchingStore } from "../../../store/FetchingApiStore";
import { formatDateLocale, getWeekByDate } from "../../../utils/datetimeUtil";
import WithTimesLoaderWrapper from "../hocs/WithTimesLoaderWrapper";
import WithDoctorLoaderWrapper from "../../staff/hocs/WithDoctorLoaderWrapper";
import timeOffServices from "../../../services/timeOffServices";
import { useCustomModal } from "../../../components/CustomModal";
import AddNewTimeOffModal from "../components/AddNewTimeOffModal";
import {
  findBookingsByDate,
  getSessionByTimeStart,
  groupSchedulesDayOfWeekAndSession,
  isTimeOffAtThisScheduleTime
} from "./utils";
import { normalizeStrToDateStr } from "../../../utils/standardizedForForm";
import { scheduleSessions } from "../../../entities/Schedule";
import BookingInfoModal from "../../booking/components/BookingInfoModal";
import { useAppConfigStore } from "../../../store/AppConfigStore";

function DoctorScheduleCalendar({ timesList, doctor }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [schedules, setSchedules] = useState([]);
  const [timeOffs, setTimeOffs] = useState([]);

  const [currentDate, setCurrentDate] = useState(
    new Date(normalizeStrToDateStr(qs.parse(location.search)?.date, new Date()))
  );

  const params = useParams();
  const { staffId } = params;

  const theme = useTheme();

  const { isLoading, fetchApi } = useFetchingStore();

  const { locale } = useAppConfigStore();

  const addTimeOffModal = useCustomModal();
  const bookingInfoModal = useCustomModal();

  const { t } = useTranslation("scheduleFeature", { keyPrefix: "DoctorScheduleCalendar" });

  const heads = useMemo(() => getWeekByDate(currentDate), [currentDate]);

  const loadData = async () => {
    await fetchApi(async () => {
      const res = await scheduleServices.getScheduleListByDoctorId(staffId, heads[0], heads[6]);

      if (res.success) {
        const schedulesData = res.schedules;
        // console.log("res: ", res);
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

  // console.log("timeOffs: ", timeOffs);

  useEffect(() => {
    loadData();
  }, [heads]);

  useEffect(() => {
    loadTimeOffs();
  }, [heads]);

  useMemo(() => {
    const code = locale?.slice(0, 2) || "vi";
    formatDate.locale(formatDateLocale[code]);
  }, [locale]);

  const schedulesDayOfWeekAndSession = useMemo(() => {
    return groupSchedulesDayOfWeekAndSession(schedules);
  }, [schedules]);

  // return <div>sang</div>;

  const renderCell = (schedule, colDate, time) => {
    // console.log("schedule: ", schedule);
    const booking = findBookingsByDate(schedule?.bookings, colDate, time);
    // console.log("booking: ", booking);
    const scheduleStartTime = time.timeStart;
    const scheduleEndTime = time.timeEnd;

    // Chuyển scheduleStartTime và scheduleEndTime về dạng Date String với ngày là ứng với colDate
    const scheduleStartTimeStr = `${formatDate.format(colDate, "YYYY-MM-DD")} ${scheduleStartTime}`;
    const scheduleEndTimeStr = `${formatDate.format(colDate, "YYYY-MM-DD")} ${scheduleEndTime}`;

    const isTimeOff = isTimeOffAtThisScheduleTime(timeOffs, colDate, time);

    const now = new Date();

    // Nếu now > startTime thì thì isOutOfTime = true;
    // Sử dụng để hiển Box che mờ Tabel Cell nếu đã vượt giờ khám
    const isOutOfTime = formatDate.subtract(now, new Date(scheduleStartTimeStr)).toMilliseconds() > 0;

    // Nếu now thuộc start -> end => là ca hiện tại => true
    // Dùng để hiển thị màu của Table Cell khác biệt
    const isCurrentTime =
      formatDate.subtract(now, new Date(scheduleStartTimeStr)).toMilliseconds() > 0 &&
      formatDate.subtract(now, new Date(scheduleEndTimeStr)).toMilliseconds() < 0;

    return (
      <TableCell
        key={colDate}
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
              {/* Hiển thị loại khám Online - Offline */}
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
                <Typography sx={{}}>{schedule?.type}</Typography>
              </Box>

              {/* Hiển thị trạng thái booking trong schedule */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexGrow: 1,
                  bgcolor: isCurrentTime ? theme.palette.info.light : booking && theme.palette.success.light,
                  // bgcolor: isCurrentTime ? "red" : "inherit",
                  position: "relative",
                  cursor: booking && "pointer"
                }}
                onClick={() => {
                  if (booking) {
                    // console.log("booking: ", booking);
                    bookingInfoModal.setShow(true);
                    bookingInfoModal.setData(booking?.id);
                  }
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
                  {booking ? t("button.booked") : ""}
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
              bgcolor: "rgba(204,204,204,0.6)",
              pointerEvents: "none"
            }}
          />
        )}
      </TableCell>
    );
  };

  const renderCols = (time) => {
    // Group các schedules lại theo dayOfWeek => để dựa trên dayOfWeek truy xuất schedule của ngày đó

    const cols = Array.from({ length: 7 }, (_, index) => {
      const schedulesBySession = schedulesDayOfWeekAndSession[index];
      let schedule;
      const session = getSessionByTimeStart(time.timeStart);
      if (session === scheduleSessions.MORNING) {
        schedule = schedulesBySession.morning;
      } else {
        schedule = schedulesBySession.afternoon;
      }

      const colDate = heads[index];
      return renderCell(schedule, colDate, time);
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

                const searchParams = qs.stringify({ date: formatDate.format(newCurrentDate, "YYYY-MM-DD") });
                navigate(`?${searchParams}`);
              }}
            >
              <ArrowLeftIcon fontSize="large" />
            </IconButton>
            <Button
              variant="contained"
              onClick={() => {
                setCurrentDate(() => new Date());
                const searchParams = qs.stringify({ date: formatDate.format(new Date(), "YYYY-MM-DD") });
                navigate(`?${searchParams}`);
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

                const searchParams = qs.stringify({ date: formatDate.format(newCurrentDate, "YYYY-MM-DD") });

                navigate(`?${searchParams}`);
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
                      {formatDate.format(cell, "DD/MM (ddd)")}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {timesList?.map((row, index) => {
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

                    {renderCols(timesList[index])}
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
      {bookingInfoModal.show && (
        <BookingInfoModal
          show={bookingInfoModal.show}
          setShow={bookingInfoModal.setShow}
          data={bookingInfoModal.data}
          setData={bookingInfoModal.setData}
        />
      )}
    </>
  );
}

DoctorScheduleCalendar.propTypes = {
  timesList: PropTypes.array.isRequired,
  doctor: PropTypes.object.isRequired
};

export default WithTimesLoaderWrapper(WithDoctorLoaderWrapper(DoctorScheduleCalendar));
