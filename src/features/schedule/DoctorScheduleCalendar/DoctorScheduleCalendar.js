import PropTypes from "prop-types";
import { Add as AddIcon, ArrowLeft as ArrowLeftIcon, ArrowRight as ArrowRightIcon, Preview } from "@mui/icons-material";
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
  Typography
} from "@mui/material";

import formatDate from "date-and-time";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import qs from "query-string";

import { subject } from "@casl/ability";
import CustomOverlay from "../../../components/CustomOverlay";

import scheduleServices from "../../../services/scheduleServices";
import { useFetchingStore } from "../../../store/FetchingApiStore";
import { formatDateLocale, getWeekByDate } from "../../../utils/datetimeUtil";
import WithTimesLoaderWrapper from "../hocs/WithTimesLoaderWrapper";
// import WithDoctorLoaderWrapper from "../../staff/hocs/WithDoctorLoaderWrapper";
import timeOffServices from "../../../services/timeOffServices";
import { useCustomModal } from "../../../components/CustomModal";
import AddNewTimeOffModal from "../components/AddNewTimeOffModal";
import {
  groupBookingSchedulesByScheduleAndDateAndTime,
  groupBookingsByScheduleAndDateAndTime,
  groupSchedulesDayOfWeekAndSession,
  isTimeOffAtThisScheduleTime
} from "./utils";
import { normalizeStrToDateStr } from "../../../utils/standardizedForForm";
import { scheduleSessions, scheduleTypes } from "../../../entities/Schedule";
import BookingInfoModal from "../../booking/components/BookingInfoModal";
import { useAppConfigStore } from "../../../store/AppConfigStore";
import { useScheduleTypesContantTranslation } from "../hooks/useScheduleConstantsTranslation";
import CustomPageTitle from "../../../components/CustomPageTitle";
import { Can } from "../../../store/AbilityStore";
import { staffActionAbility } from "../../../entities/Staff";
import bookingServices from "../../../services/bookingServices";
import { bookingMethods } from "../../../entities/Booking/constant";
import BookingModal from "../../booking/components/BookingModal";
import StaffInfoCard from "../../../components/StaffInfoCard";

const EMPTY_CELL = "EMPTY_CELL";
const FULL_SLOT = "FULL_SLOT";
const BOOK = "BOOK";

function DoctorScheduleCalendar({ timesList, staff }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [schedules, setSchedules] = useState([]);
  const [timeOffs, setTimeOffs] = useState([]);
  const [bookingSchedules, setBookingSchedules] = useState([]);

  // console.log("schedules: ", schedules);
  // console.log("timeOffs: ", timeOffs);

  const [currentDate, setCurrentDate] = useState(
    new Date(normalizeStrToDateStr(qs.parse(location.search)?.date, new Date()))
  );

  const staffId = staff?.id;
  // console.log("staffId: ", staffId);

  const theme = useTheme();

  const { isLoading, fetchApi } = useFetchingStore();

  const { locale } = useAppConfigStore();

  const addTimeOffModal = useCustomModal();
  const bookingInfoModal = useCustomModal();
  const bookingModal = useCustomModal();

  const { t } = useTranslation("scheduleFeature", { keyPrefix: "DoctorScheduleCalendar" });
  const [, scheduleTypeContantListObj] = useScheduleTypesContantTranslation();
  // console.log({ scheduleTypeContantList, scheduleTypeContantListObj });

  const heads = useMemo(() => getWeekByDate(currentDate), [currentDate]);

  const loadData = async () => {
    let schedulesData = [];
    let bookingSchedulesData = [];

    await fetchApi(async () => {
      const res = await scheduleServices.getScheduleListByDoctorId(
        staffId,
        formatDate.format(heads[0], "YYYY-MM-DD"),
        formatDate.format(heads[6], "YYYY-MM-DD")
      );

      if (res.success) {
        schedulesData = [...res.schedules];
        // console.log("res: ", res);
        // setSchedules(schedulesData);
        return { ...res };
      }
      return { ...res };
    });

    await fetchApi(async () => {
      // Sử dụng phương thức map() để trích xuất các idExpertise
      const expertiseIdsFull = schedulesData.map((schedule) => schedule.idExpertise);

      // Sử dụng phương thức filter() và indexOf() để lọc ra các idExpertise duy nhất
      const expertiseIds = expertiseIdsFull.filter((id, index, self) => self.indexOf(id) === index);

      // console.log("expertiseIds: ", expertiseIds);
      const res = await bookingServices.getCountBookingSchedule({
        expertiseIds,
        doctorId: staffId,
        from: formatDate.format(heads[0], "YYYY-MM-DD"),
        to: formatDate.format(heads[6], "YYYY-MM-DD"),
        bookingMethod: bookingMethods.REDIRECT
      });

      if (res.success) {
        bookingSchedulesData = [...res.bookingSchedules];
        return { ...res };
      }
      return { ...res };
    });

    setSchedules([...schedulesData]);
    setBookingSchedules([...bookingSchedulesData]);
  };

  // console.log("staff: ", staff);

  // console.log("schedules: ", schedules);
  // console.log("bookingSchedules: ", bookingSchedules);
  // console.log("timeOffs: ", timeOffs);

  const loadTimeOffs = async () => {
    await fetchApi(async () => {
      const res = await timeOffServices.getTimeOffByDoctorId(staffId, {
        from: formatDate.format(heads[0], "YYYY-MM-DD"),
        to: formatDate.format(heads[6], "YYYY-MM-DD")
      });

      if (res.success) {
        const timeOffsData = res.timeOffs;
        setTimeOffs(timeOffsData);
        return { ...res };
      }
      setTimeOffs([]);
      return { ...res };
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

  const [schedulesDayOfWeekAndSession, bookingsByScheduleAnnDateAndTime] = useMemo(() => {
    return [groupSchedulesDayOfWeekAndSession(schedules), groupBookingsByScheduleAndDateAndTime(schedules)];
  }, [schedules]);

  const bookingSchedulesByScheduleAndDateAndTime = useMemo(() => {
    return groupBookingSchedulesByScheduleAndDateAndTime(bookingSchedules);
  }, [bookingSchedules]);

  const renderIsTimeOff = (isTimeOff) => {
    return (
      isTimeOff && (
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
      )
    );
  };

  const renderCellBtn = (variant, isCurrentTime, isTimeOff, bookData = {}) => {
    switch (variant) {
      case FULL_SLOT:
        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexGrow: 1,
              bgcolor: isCurrentTime ? theme.palette.info.light : theme.palette.success.light,
              position: "relative",
              cursor: "pointer"
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
              {t("button.fullSlot")}
            </Typography>

            {renderIsTimeOff(isTimeOff)}
          </Box>
        );

      case BOOK:
        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexGrow: 1,
              position: "relative",
              cursor: "pointer"
            }}
          >
            <Button
              variant="contained"
              sx={{
                backgroundColor: "inherit",
                color: theme.palette.success.light,
                ":hover": {
                  background: theme.palette.success.light,
                  color: theme.palette.success.contrastText
                }
              }}
              onClick={() => {
                bookingModal.setShow(true);
                bookingModal.setData({ ...bookData });
              }}
            >
              {t("button.book")}
            </Button>

            {renderIsTimeOff(isTimeOff)}
          </Box>
        );

      case EMPTY_CELL:
      default:
        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexGrow: 1,
              position: "relative",
              cursor: "pointer"
            }}
          >
            {renderIsTimeOff(isTimeOff)}
          </Box>
        );
    }
  };

  const renderCell = (schedule, colDate, time) => {
    const colDateFormat = formatDate.format(colDate, "YYYY-MM-DD");
    const bookings = bookingsByScheduleAnnDateAndTime[schedule?.id]?.[colDateFormat]?.[time?.id];

    const scheduleStartTime = time.timeStart;
    const scheduleEndTime = time.timeEnd;
    const typeLabel = scheduleTypeContantListObj[schedule?.type]?.label;

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

    const bookingSchedule = bookingSchedulesByScheduleAndDateAndTime[schedule?.id]?.[colDateFormat]?.[time?.id];

    const isStaffCanBooking = scheduleTypes.TYPE_OFFLINE === schedule?.type;
    let isFullSlot = false;
    if (bookingSchedule) {
      const totalBookingOffline = bookingSchedule?.totalBookingOffline || 0;
      const totalOffBookOnl = bookingSchedule?.totalOffBookOnl || 0;
      const amountSfaffCanbooking = totalBookingOffline - totalOffBookOnl || 0;

      isFullSlot = bookingSchedule?.countBooking >= amountSfaffCanbooking;
    }

    let variant = EMPTY_CELL;
    let bookData;
    if (isStaffCanBooking) {
      if (isFullSlot) variant = FULL_SLOT;
      else {
        variant = BOOK;
        bookData = {
          schedule,
          date: colDate,
          time
        };
      }
      // } else if (bookings && bookings?.length > 0) {
      //   variant = FULL_SLOT;
    } else {
      variant = EMPTY_CELL;
    }

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
                  alignItems: "center",
                  cursor: "pointer"
                }}
                onClick={() => {
                  if (bookings) {
                    // console.log("booking: ", booking);
                    bookingInfoModal.setShow(true);
                    bookingInfoModal.setData({ bookings, scheduleStartTime, scheduleEndTime, typeLabel });
                  }
                }}
              >
                <Typography sx={{ mx: 1 }}>{typeLabel}</Typography>
                {bookings && bookings?.length > 0 && <Preview sx={{ mx: 1 }} />}
              </Box>

              {/* Hiển thị trạng thái booking trong schedule */}
              {renderCellBtn(variant, isCurrentTime, isTimeOff, bookData)}
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
      // schedulesBySession là 1 obj có 2 key morning và afternoon
      const schedulesBySession = schedulesDayOfWeekAndSession[index];
      let schedule;
      const { session } = time;

      switch (session) {
        case scheduleSessions.MORNING:
          schedule = schedulesBySession.morning || schedulesBySession.wholeDay;
          break;

        case scheduleSessions.AFFTERNOON:
          schedule = schedulesBySession.afternoon || schedulesBySession.wholeDay;
          break;

        case scheduleSessions.EVENING:
          schedule = schedulesBySession.evening || schedulesBySession.wholeDay;
          break;

        default:
          break;
      }

      const colDate = heads[index];
      return renderCell(schedule, colDate, time);
    });

    return cols;
  };

  const handleAfterAddTimeOff = async () => {
    await loadTimeOffs();
  };

  const handleAfterBooking = async () => {
    await loadData();
  };

  return (
    <>
      <Box>
        <CustomOverlay open={isLoading} />
        <CustomPageTitle title={t("title")} />
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          {staff && staff?.id && <StaffInfoCard staff={staff} />}

          <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
            <Can I={staffActionAbility.ADD_DOCTOR_TIMEOFF} this={subject("Staff", staff)}>
              <Button
                variant="contained"
                onClick={() => {
                  addTimeOffModal.setShow(true);
                  addTimeOffModal.setData(staff);
                }}
                endIcon={<AddIcon fontSize="large" />}
                sx={{
                  bgcolor: theme.palette.success.light
                }}
              >
                {t("button.addTimeOff")}
              </Button>
            </Can>
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

      {bookingModal.show && (
        <BookingModal
          show={bookingModal.show}
          setShow={bookingModal.setShow}
          data={bookingModal.data}
          setData={bookingModal.setData}
          handleAfterBooking={handleAfterBooking}
        />
      )}
    </>
  );
}

DoctorScheduleCalendar.propTypes = {
  timesList: PropTypes.array.isRequired,
  staff: PropTypes.object.isRequired
};

// export default WithTimesLoaderWrapper(WithDoctorLoaderWrapper(DoctorScheduleCalendar));
export default WithTimesLoaderWrapper(DoctorScheduleCalendar);
