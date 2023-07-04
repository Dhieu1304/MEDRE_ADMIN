import PropTypes from "prop-types";

import { ArrowLeft as ArrowLeftIcon, ArrowRight as ArrowRightIcon, Preview as PreviewIcon } from "@mui/icons-material";
import {
  Table,
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
  Typography,
  TableBody,
  useTheme,
  TextField
  // Card
} from "@mui/material";

import formatDate from "date-and-time";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import qs from "query-string";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAbility } from "@casl/react";
import { useFetchingStore } from "../../../store/FetchingApiStore";
import WithTimesLoaderWrapper from "../hocs/WithTimesLoaderWrapper";
import staffServices from "../../../services/staffServices";
import { staffRoles } from "../../../entities/Staff";
import timeOffServices from "../../../services/timeOffServices";
import {
  groupBookingSchedulesByScheduleAndDateAndTime,
  groupBookingsByScheduleAndDateAndTime,
  groupSchedulesBySession,
  isTimeOffAtThisScheduleTime
} from "./utils";
import { scheduleSessions, scheduleTypes } from "../../../entities/Schedule";
import BookingInfoModal from "../../booking/components/BookingInfoModal";
import { useCustomModal } from "../../../components/CustomModal";
import CustomOverlay from "../../../components/CustomOverlay/CustomOverlay";
import BookingModal from "../../booking/components/BookingModal";
import CustomPageTitle from "../../../components/CustomPageTitle";
import { useScheduleTypesContantTranslation } from "../hooks/useScheduleConstantsTranslation";
import bookingServices from "../../../services/bookingServices";
import { bookingActionAbility, bookingMethods } from "../../../entities/Booking";
import { normalizeStrToDateStr } from "../../../utils/standardizedForForm";
import BookingNoDataModal from "../../booking/components/BookingNoDataModal";
import { AbilityContext } from "../../../store/AbilityStore";
import entities from "../../../entities/entities";
import BookingBtn from "../../booking/components/BookingButton/BookingBtn";
import ViewBookingBtn from "../../booking/components/BookingButton/ViewBookingBtn";
import routeConfig from "../../../config/routeConfig";

const EMPTY_CELL = "EMPTY_CELL";
const FULL_SLOT = "FULL_SLOT";
const BOOK = "BOOK";

function ScheduleList({ timesList }) {
  const location = useLocation();
  const [currentDate, setCurrentDate] = useState(
    new Date(normalizeStrToDateStr(qs.parse(location.search)?.date, new Date()))
  );
  const [doctors, setDoctors] = useState([]);
  const [bookingSchedules, setBookingSchedules] = useState([]);
  const [timeOffsGroupByDoctorId, setTimeOffsGroupByDoctorId] = useState([]);

  const { isLoading, fetchApi } = useFetchingStore();
  const { t } = useTranslation("scheduleFeature", { keyPrefix: "ScheduleList" });
  const theme = useTheme();
  const navigate = useNavigate();
  const bookingInfoModal = useCustomModal();
  const bookingModal = useCustomModal();
  const bookingNoDataModal = useCustomModal();

  const [, scheduleTypeContantListObj] = useScheduleTypesContantTranslation();

  // console.log("currentDate: ", currentDate);

  const loadTimeOffs = async () => {
    await fetchApi(async () => {
      const res = await timeOffServices.getTimeOffByDoctorId(undefined, {
        from: formatDate.format(currentDate, "YYYY-MM-DD"),
        to: formatDate.format(currentDate, "YYYY-MM-DD")
      });
      if (res.success) {
        const timeOffsData = res.timeOffs;

        const timeOffsObjData = timeOffsData.reduce((result, timeOff) => {
          const newResult = { ...result };
          if (!newResult[timeOff.doctorId]) {
            newResult[timeOff.idDoctor] = [];
          }
          newResult[timeOff.idDoctor].push(timeOff);
          return { ...newResult };
        }, {});

        setTimeOffsGroupByDoctorId({ ...timeOffsObjData });
        // timeOffsOfDoctor.push(timeOffsData);
        return { ...res };
      }
      setTimeOffsGroupByDoctorId([]);
      return { ...res };
    });
  };

  // console.log("doctors: ", doctors);
  // console.log("timeOffsObj: ", timeOffsGroupByDoctorId);

  useEffect(() => {
    loadTimeOffs();
  }, [doctors, currentDate]);

  const loadData = async () => {
    let doctorsData = [];
    let bookingSchedulesData = [];

    await fetchApi(async () => {
      const paramsObj = {
        role: staffRoles.ROLE_DOCTOR,
        limit: 200,
        date: formatDate.format(currentDate, "YYYY-MM-DD")
      };
      const res = await staffServices.getStaffListWithSchedules(paramsObj);

      // let countData = 0;
      // let staffsData = [];

      if (res.success) {
        doctorsData = [...res.staffs];
        return { ...res };
      }
      return { ...res };
    });

    const doctorIds = [];
    const expertiseIds = [];

    // console.log("doctorsData: ", doctorsData);

    doctorsData?.forEach((doctor) => {
      doctorIds.push(doctor.id);

      doctor?.staffSchedules.forEach((schedule) => {
        if (!expertiseIds.includes(schedule.idExpertise)) {
          expertiseIds.push(schedule.idExpertise);
        }
      });
    });

    // console.log("Doctors ID:", doctorIds);
    // console.log("Expertise IDs:", expertiseIds);

    await fetchApi(async () => {
      // console.log("expertiseIds: ", expertiseIds);
      const res = await bookingServices.getCountBookingScheduleByManyStaff({
        expertiseIds,
        doctorIds,
        from: formatDate.format(currentDate, "YYYY-MM-DD"),
        to: formatDate.format(currentDate, "YYYY-MM-DD"),
        bookingMethod: bookingMethods.REDIRECT
      });

      if (res.success) {
        bookingSchedulesData = [...res.bookingSchedules];
        return { ...res };
      }
      return { ...res };
    });

    setDoctors([...doctorsData]);
    setBookingSchedules([...bookingSchedulesData]);
  };

  useEffect(() => {
    loadData();

    const searchParams = qs.stringify({ date: formatDate.format(currentDate, "YYYY-MM-DD") });
    navigate(`?${searchParams}`);
  }, [currentDate]);

  // console.log("doctors: ", doctors);
  // console.log("bookingSchedules: ", bookingSchedules);

  // const [rows, schedulesTimeOff] = useMemo(() => {
  //   return filterDoctorsByDayOfWeek(doctors, timesList, currentDate, timeOffs);
  // }, [doctors, timeOffs, timesList]);

  const ability = useAbility(AbilityContext);
  const canBooking = ability.can(bookingActionAbility.ADD, entities.BOOKING);

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

  const renderCellBtn = (variant, isCurrentTime, isTimeOff, previewBooking, bookData = {}) => {
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
            onClick={() => previewBooking()}
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
            {canBooking ? (
              <BookingBtn
                label={t("button.book")}
                onClick={() => {
                  bookingModal.setShow(true);
                  bookingModal.setData({ ...bookData });
                }}
              />
            ) : (
              <ViewBookingBtn
                label={t("button.view")}
                onClick={() => {
                  previewBooking();
                }}
              />
            )}

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
            <Button
              variant="contained"
              sx={{
                backgroundColor: "inherit",
                color: theme.palette.info.light,
                ":hover": {
                  background: theme.palette.info.light,
                  color: theme.palette.info.contrastText
                }
              }}
              onClick={() => {
                previewBooking();
              }}
            >
              {t("button.view")}
            </Button>

            {renderIsTimeOff(isTimeOff)}
          </Box>
        );
    }
  };

  // const renderButton = (booking, schedule, time) => {
  //   if (booking) {
  //     return (
  //       <Button
  //         variant="outlined"
  //         onClick={() => {
  //           bookingInfoModal.setShow(true);
  //           bookingInfoModal.setData(booking);
  //         }}
  //       >
  //         {t("button.booked")}
  //       </Button>
  //     );
  //   }

  //   return (
  //     <Button
  //       variant="contained"
  //       sx={{
  //         backgroundColor: "inherit",
  //         color: theme.palette.success.light,
  //         ":hover": {
  //           background: theme.palette.success.light,
  //           color: theme.palette.success.contrastText
  //         }
  //       }}
  //       onClick={() => {
  //         bookingModal.setShow(true);
  //         bookingModal.setData({
  //           schedule,
  //           date: currentDate,
  //           time
  //         });
  //       }}
  //     >
  //       {t("button.book")}
  //     </Button>
  //   );
  // };

  // console.log("doctorss: ", doctors);
  // console.log("bookingSchedules: ", bookingSchedules);

  const renderCols = (doctor) => {
    // console.log("doctor?.staffSchedules: ", doctor?.staffSchedules);
    const schedulesGroupBySession = groupSchedulesBySession(doctor?.staffSchedules, currentDate);
    const bookingsByScheduleAnnDateAndTime = groupBookingsByScheduleAndDateAndTime(doctor?.staffSchedules);

    // console.log("schedulesGroupBySession: ", schedulesGroupBySession);

    return timesList.map((time) => {
      const timeId = time?.id;

      let schedule;
      const { session } = time;

      switch (session) {
        case scheduleSessions.MORNING:
          schedule = schedulesGroupBySession.morning || schedulesGroupBySession.wholeDay;
          break;

        case scheduleSessions.AFFTERNOON:
          schedule = schedulesGroupBySession.afternoon || schedulesGroupBySession.wholeDay;
          break;

        case scheduleSessions.EVENING:
          schedule = schedulesGroupBySession.evening || schedulesGroupBySession.wholeDay;
          break;

        default:
          break;
      }

      /// /////////////////////////////////////

      const typeLabel = scheduleTypeContantListObj[schedule?.type]?.label;
      const scheduleStartTime = time.timeStart;
      const scheduleEndTime = time.timeEnd;

      const currentDateFormat = formatDate.format(currentDate, "YYYY-MM-DD");

      const bookings = bookingsByScheduleAnnDateAndTime[schedule?.id]?.[currentDateFormat]?.[time?.id];

      const timeOffs = timeOffsGroupByDoctorId[doctor?.id];
      const isTimeOff = isTimeOffAtThisScheduleTime(timeOffs, currentDate, time);

      const bookingSchedule = bookingSchedulesByScheduleAndDateAndTime[schedule?.id]?.[time?.id];

      const isStaffCanBooking = scheduleTypes.TYPE_OFFLINE === schedule?.type;

      const totalBookingOffline = bookingSchedule?.totalBookingOffline || 0;
      const totalOffBookOnl = bookingSchedule?.totalOffBookOnl || 0;
      const amountSfaffCanbooking = totalBookingOffline - totalOffBookOnl || 0;
      const countBooking = bookingSchedule?.countBooking || 0;

      let rate = "";

      if (schedule?.type === scheduleTypes.TYPE_OFFLINE) {
        rate = amountSfaffCanbooking > 0 ? `${countBooking}/${amountSfaffCanbooking}` : "";
      }
      // else if (schedule?.type === scheduleTypes.TYPE_ONLINE) {
      // }

      let isFullSlot = false;
      if (bookingSchedule) {
        isFullSlot = countBooking >= amountSfaffCanbooking;
      }

      let variant = EMPTY_CELL;
      let bookData;
      if (isStaffCanBooking) {
        if (isFullSlot) variant = FULL_SLOT;
        else {
          variant = BOOK;
          bookData = {
            schedule,
            date: currentDate,
            time
          };
        }
        // } else if (bookings && bookings?.length > 0) {
        //   variant = FULL_SLOT;
      } else {
        variant = EMPTY_CELL;
      }

      const previewBooking = () => {
        if (bookings) {
          // console.log("booking: ", booking);
          bookingInfoModal.setShow(true);
          bookingInfoModal.setData({ bookings, scheduleStartTime, scheduleEndTime, typeLabel });
        } else {
          bookingNoDataModal.setShow(true);
        }
      };

      return schedule ? (
        <TableCell
          key={timeId}
          sx={{
            border: "1px solid rgba(0,0,0,0.2)",
            p: 0,
            position: "relative",
            bgcolor: isTimeOff ? "rgba(255, 246, 143, 0.4)" : "inherit",
            minWidth: 180
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
                  onClick={() => {
                    previewBooking();
                  }}
                >
                  <Typography sx={{ mx: 0.5 }}>{typeLabel}</Typography>
                  {rate && <Typography sx={{ color: theme.palette.error.light, mx: 0.5 }}>{rate}</Typography>}
                  {bookings && bookings?.length > 0 && <PreviewIcon sx={{ mx: 1 }} />}
                </Box>

                {/* Hiển thị trạng thái booking trong schedule */}
                {renderCellBtn(variant, false, isTimeOff, previewBooking, bookData)}
              </>
            )}
          </Box>
        </TableCell>
      ) : (
        <TableCell
          key={timeId}
          sx={{
            border: "1px solid rgba(0,0,0,0.4)",
            p: 0,
            position: "relative"
          }}
          align="center"
        />
      );
    });
  };

  const handleAfterBooking = async () => {
    await loadData();
  };

  // console.log("currentDate: ", currentDate);

  return (
    <>
      <CustomOverlay open={isLoading} />
      <Box>
        <CustomPageTitle title={t("title")} />

        <Box
          sx={{
            display: "flex",
            flexDirection: {
              md: "row",
              xs: "column"
            },
            justifyContent: {
              md: "flex-end",
              xs: "center"
            },
            alignItems: "center",
            mb: 4
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: {
                md: "flex-end",
                xs: "center"
              },
              alignItems: "center"
            }}
          >
            <TextField
              value={formatDate.format(currentDate, "YYYY-MM-DD")}
              onChange={(e) => {
                // console.log("e.target.value: ", e.target.value);
                setCurrentDate(() => new Date(e.target.value));
              }}
              type="date"
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: {
                md: "flex-end",
                xs: "center"
              },
              alignItems: "center"
            }}
          >
            <IconButton
              onClick={() => {
                const newCurrentDate = new Date(currentDate);
                newCurrentDate.setDate(newCurrentDate.getDate() - 1);
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
              {t("button.today")}
            </Button>
            <IconButton
              onClick={() => {
                const newCurrentDate = new Date(currentDate);
                newCurrentDate.setDate(newCurrentDate.getDate() + 1);
                setCurrentDate(() => newCurrentDate);
              }}
            >
              <ArrowRightIcon fontSize="large" />
            </IconButton>
          </Box>
        </Box>

        <TableContainer
          component={Paper}
          sx={{
            height: 600
          }}
        >
          <Table size="small" aria-label="a dense table" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    border: "1px solid rgba(0,0,0,0.2)",
                    position: "sticky",
                    left: 0,
                    zIndex: 2,
                    backgroundColor: "#fff"
                  }}
                />
                {timesList?.map((time) => {
                  return (
                    <TableCell
                      sx={{
                        border: "1px solid rgba(0,0,0,0.2)",
                        fontWeight: "600",
                        position: "sticky",
                        left: 0,
                        zIndex: 1
                      }}
                      key={time?.id}
                      align="center"
                    >
                      {`${time?.timeStart.split(":")[0]}:${time?.timeStart.split(":")[1]}`}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {doctors.map((doctor) => {
                return (
                  <TableRow key={doctor.id}>
                    <TableCell
                      sx={{
                        border: "1px solid rgba(0,0,0,0.2)",
                        fontWeight: "600",
                        minWidth: 200,
                        position: "sticky",
                        left: 0,
                        zIndex: 1,
                        backgroundColor: "#fff"
                      }}
                      component="th"
                      scope="row"
                    >
                      <Box
                        component={Link}
                        to={`${routeConfig.staff}/${doctor?.id}/calendar`}
                        sx={{ textDecoration: "none", display: "flex", alignItems: "center", color: "inherit" }}
                      >
                        {doctor?.name}
                      </Box>
                    </TableCell>

                    {renderCols(doctor)}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
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

      {bookingNoDataModal.show && <BookingNoDataModal show={bookingNoDataModal.show} setShow={bookingNoDataModal.setShow} />}
    </>
  );
}

ScheduleList.propTypes = {
  timesList: PropTypes.array.isRequired
};

export default WithTimesLoaderWrapper(ScheduleList);
