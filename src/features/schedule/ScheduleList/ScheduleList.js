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
  useTheme
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

function ScheduleList({ timesList }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [doctors, setDoctors] = useState([]);
  const [timeOffsObj, setTimeOffsObj] = useState([]);

  const { fetchApi } = useFetchingStore();
  const { t } = useTranslation("scheduleFeature", { keyPrefix: "ScheduleList" });
  const theme = useTheme();
  const bookingInfoModal = useCustomModal();

  const loadTimeOffs = async () => {
    await fetchApi(async () => {
      const res = await timeOffServices.getTimeOffByDoctorId(undefined, { from: currentDate, to: currentDate });
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

        setTimeOffsObj({ ...timeOffsObjData });
        // timeOffsOfDoctor.push(timeOffsData);
        return { success: true, error: "" };
      }
      setTimeOffsObj([]);
      return { success: false, error: res.message };
    });
  };

  // console.log("timeOffs: ", timeOffs);

  useEffect(() => {
    loadTimeOffs();
  }, [doctors, currentDate]);

  const loadData = async () => {
    await fetchApi(async () => {
      const paramsObj = {
        role: staffRoles.ROLE_DOCTOR,
        limit: 200,
        date: currentDate
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

  const renderButton = (booking) => {
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
      >
        {t("button.book")}
      </Button>
    );
  };

  const renderCols = (doctor) => {
    const schedulesGroupBySession = groupSchedulesBySession(doctor?.staffSchedules, currentDate);

    // console.log("schedulesGroupBySession: ", schedulesGroupBySession);

    return timesList.map((time) => {
      const timeId = time?.id;
      let schedule;
      if (time?.session === scheduleSessions.MORNING) {
        schedule = schedulesGroupBySession.morning;
      } else {
        schedule = schedulesGroupBySession.afternoon;
      }

      const timeOffs = timeOffsObj[doctor?.id];

      const isTimeOff = isTimeOffAtThisScheduleTime(timeOffs, currentDate, time);

      const booking = findBookingsByDate(schedule?.bookings, currentDate, time);

      return schedule ? (
        <TableCell
          key={timeId}
          sx={{
            border: "1px solid rgba(0,0,0,0.4)",
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
                  {renderButton(booking)}
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

  return (
    <>
      <Box>
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
        <TableContainer component={Paper}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    border: "1px solid rgba(0,0,0,0.2)",
                    position: "sticky",
                    left: 0,
                    zIndex: 1,
                    backgroundColor: "#fff"
                  }}
                />
                {timesList?.map((time) => {
                  return (
                    <TableCell
                      sx={{
                        border: "1px solid rgba(0,0,0,0.2)",
                        fontWeight: "600"
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
    </>
  );
}

ScheduleList.propTypes = {
  timesList: PropTypes.array.isRequired
};

export default WithTimesLoaderWrapper(ScheduleList);
