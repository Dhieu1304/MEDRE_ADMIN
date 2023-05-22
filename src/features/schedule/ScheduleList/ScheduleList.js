import PropTypes from "prop-types";

import { ArrowLeft as ArrowLeftIcon, ArrowRight as ArrowRightIcon } from "@mui/icons-material";
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
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useFetchingStore } from "../../../store/FetchingApiStore";
import WithTimesLoaderWrapper from "../hocs/WithTimesLoaderWrapper";
import staffServices from "../../../services/staffServices";
import { staffRoles } from "../../../entities/Staff";
import timeOffServices from "../../../services/timeOffServices";
import { findBookingsByDate, groupSchedulesBySession, isTimeOffAtThisScheduleTime } from "./utils";
import { scheduleSessions } from "../../../entities/Schedule";
import BookingInfoModal from "../../booking/components/BookingInfoModal";
import { useCustomModal } from "../../../components/CustomModal";
import CustomOverlay from "../../../components/CustomOverlay/CustomOverlay";
import BookingModal from "../../booking/components/BookingModal";
import CustomPageTitle from "../../../components/CustomPageTitle";

function ScheduleList({ timesList }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [doctors, setDoctors] = useState([]);
  const [timeOffsGroupByDoctorId, setTimeOffsGroupByDoctorId] = useState([]);

  const { isLoading, fetchApi } = useFetchingStore();
  const { t } = useTranslation("scheduleFeature", { keyPrefix: "ScheduleList" });
  const theme = useTheme();
  const bookingInfoModal = useCustomModal();
  const bookingModal = useCustomModal();

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
        return { success: true, error: "" };
      }
      setTimeOffsGroupByDoctorId([]);
      return { success: false, error: res.message };
    });
  };

  // console.log("doctors: ", doctors);
  // console.log("timeOffsObj: ", timeOffsGroupByDoctorId);

  useEffect(() => {
    loadTimeOffs();
  }, [doctors, currentDate]);

  const loadData = async () => {
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
        const doctorsData = res.staffs;
        setDoctors(doctorsData);
        return { success: true, error: "" };
      }
      setDoctors([]);
      return { success: false, error: res.message };
    });
  };

  useEffect(() => {
    loadData();
  }, [currentDate]);

  // console.log("doctors: ", doctors);

  // const [rows, schedulesTimeOff] = useMemo(() => {
  //   return filterDoctorsByDayOfWeek(doctors, timesList, currentDate, timeOffs);
  // }, [doctors, timeOffs, timesList]);

  const renderButton = (booking, schedule, time) => {
    if (booking) {
      return (
        <Button
          variant="outlined"
          onClick={() => {
            bookingInfoModal.setShow(true);
            bookingInfoModal.setData(booking);
          }}
        >
          {t("button.booked")}
        </Button>
      );
    }

    return (
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
          bookingModal.setData({
            schedule,
            date: currentDate,
            time
          });
        }}
      >
        {t("button.book")}
      </Button>
    );
  };

  const renderCols = (doctor) => {
    // console.log("doctor?.staffSchedules: ", doctor?.staffSchedules);
    const schedulesGroupBySession = groupSchedulesBySession(doctor?.staffSchedules, currentDate);

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

        default:
          break;
      }

      // console.log("schedule: ", schedule);

      const timeOffs = timeOffsGroupByDoctorId[doctor?.id];

      const isTimeOff = isTimeOffAtThisScheduleTime(timeOffs, currentDate, time);

      const booking = findBookingsByDate(schedule?.bookings, currentDate, time);

      // console.log("isTimeOff: ", isTimeOff);
      // console.log("booking: ", booking);

      // return null;

      return schedule ? (
        <TableCell
          key={timeId}
          sx={{
            border: "1px solid rgba(0,0,0,0.2)",
            p: 0,
            position: "relative",
            bgcolor: isTimeOff ? "rgba(255, 246, 143, 0.4)" : "inherit"
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
                    // flexGrow: 1,
                    position: "relative",
                    py: 2,
                    px: 2,
                    minWidth: 150
                  }}
                >
                  {renderButton(booking, schedule, time)}
                  {/* <Typography
                    sx={{
                      // marginTop: "20px",
                      textAlign: "center",
                      fontWeight: "bold",
                      py: 1
                    }}
                  >
                    {booking ? t("button.booked") : ""}
                  </Typography> */}

                  {isTimeOff && (
                    <Box
                      sx={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        top: 0,
                        left: 0,
                        zIndex: 1,
                        bgcolor: "rgba(255, 246, 143, 0.4)",
                        pointerEvents: "none"
                      }}
                    />
                  )}
                </Box>
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
    loadData();
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
                      {doctor?.name}
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
    </>
  );
}

ScheduleList.propTypes = {
  timesList: PropTypes.array.isRequired
};

export default WithTimesLoaderWrapper(ScheduleList);
