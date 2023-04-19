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
  TableBody
  // Card
} from "@mui/material";

import formatDate from "date-and-time";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useFetchingStore } from "../../store/FetchingApiStore";
import WithTimesLoaderWrapper from "./hocs/WithTimesLoaderWrapper";
import staffServices from "../../services/staffServices";
import { staffRoles } from "../../entities/Staff";
import timeOffServices from "../../services/timeOffServices";
import { createDateByDateAndTimeStr, isBetweenAndNoEqual } from "../../utils/datetimeUtil";

function filterDoctorsByDayOfWeek(doctors, timesList, currentDate, timeOffs) {
  const schedulesTimeOff = {};
  const timesListObj = timesList.reduce((result, time) => {
    return {
      ...result,
      [time.id]: time
    };
  }, {});

  const filteredDoctors = doctors.map((doctor) => {
    const filteredSchedules = doctor.staffSchedules.filter((schedule) => {
      return schedule.dayOfWeek === currentDate.getDay();
    });

    const schedulesByTimeId = filteredSchedules.reduce((result, schedule) => {
      /** ***********************************************************************
      // [schedule.idTime] là 1 array vì nếu có 2 schedule trùng timeId và dayOfWeek
      // Nhưng applyFrom và applyTo đè lên nhau
      // Nghĩa là current thuộc cả applyFrom và applyTo của 2 schedule trùng timeId và dayOfWeek

      Ví dụ: ca 8h-8h30 của dayOfWeek=2 (Thứ 3 Ngày 19-4-2023 có thể có 2 cái schdule có
        - applyFrom - applyTo là 1-1-2022 => 1-1-2024
        - applyFrom - applyTo là 1-6-2022 => 1-6->2023


            return {
        ...result,
        [schedule.idTime]: [...temp, schedule]
      };


      ----
      - Hiện tại để xử lý, tạm thời, ta sẽ ghi đè các schedule có cùng idTime và dayOfWeek

      Do đó sẽ tạm thời bỏ
        const temp = result[schedule.idTime] || [];



      - Và thay
        return {
          ...result,
          [schedule.idTime]: [...temp, scheduleWithIfIsTimeOff]
        };
        Thành

        return {
          ...result,
          [schedule.idTime]: scheduleWithIfIsTimeOff
        };


      ************************************************************************ */

      // KO được XÓA
      // const temp = result[schedule.idTime] || [];

      const currentScheduleTimeStart = createDateByDateAndTimeStr(currentDate, timesListObj[schedule.idTime].timeStart);
      const currentScheduleTimeEnd = createDateByDateAndTimeStr(currentDate, timesListObj[schedule.idTime].timeEnd);

      let isTimeOff = false;
      // console.log("timeOffs[doctor?.id]: ", timeOffs[doctor?.id]);
      timeOffs[doctor?.id]?.forEach((timeOff) => {
        // console.log("timeOff: ", timeOff);
        const timeOffStart = createDateByDateAndTimeStr(new Date(timeOff.date), timeOff.timeStart);
        const timeOffEnd = createDateByDateAndTimeStr(new Date(timeOff.date), timeOff.timeEnd);

        if (isBetweenAndNoEqual(currentScheduleTimeStart, timeOffStart, timeOffEnd)) {
          isTimeOff = true;
        } else if (isBetweenAndNoEqual(currentScheduleTimeEnd, timeOffStart, timeOffEnd)) {
          isTimeOff = true;
        } else if (isBetweenAndNoEqual(timeOffStart, currentScheduleTimeStart, currentScheduleTimeEnd)) {
          isTimeOff = true;
        } else if (isBetweenAndNoEqual(timeOffEnd, currentScheduleTimeStart, currentScheduleTimeEnd)) {
          isTimeOff = true;
        }
      });

      // KO cần cái này nữa
      // const scheduleWithIfIsTimeOff = { ...schedule, isTimeOff };

      if (isTimeOff) {
        schedulesTimeOff[schedule.id] = true;
      }

      // Ko được xóa
      // return {
      //   ...result,
      //   [schedule.idTime]: [...temp, scheduleWithIfIsTimeOff]
      // };

      return {
        ...result,
        [schedule.idTime]: { ...schedule }
      };
    }, {});

    // console.log("schedulesByTimeId: ", schedulesByTimeId);

    return { ...doctor, staffSchedules: [...filteredSchedules], schedulesByTimeId };
  });
  return [filteredDoctors, schedulesTimeOff];
}

function ScheduleList({ timesList }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const [doctors, setDoctors] = useState([]);

  const [timeOffs, setTimeOffs] = useState([]);

  const { fetchApi } = useFetchingStore();

  const { t } = useTranslation("scheduleFeature", { keyPrefix: "ScheduleList" });

  const loadTimeOffs = async () => {
    await fetchApi(async () => {
      const res = await timeOffServices.getTimeOffByDoctorId(undefined, { from: currentDate, to: currentDate });
      if (res.success) {
        const timeOffsData = res.timeOffs;

        const timeOffsObj = timeOffsData.reduce((result, timeOff) => {
          const newResult = { ...result };
          if (!newResult[timeOff.doctorId]) {
            newResult[timeOff.idDoctor] = [];
          }
          newResult[timeOff.idDoctor].push(timeOff);
          return { ...newResult };
        }, {});

        setTimeOffs(timeOffsObj);
        // timeOffsOfDoctor.push(timeOffsData);
        return { success: true, error: "" };
      }
      setTimeOffs([]);
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

  const [rows, schedulesTimeOff] = useMemo(() => {
    return filterDoctorsByDayOfWeek(doctors, timesList, currentDate, timeOffs);
  }, [doctors, timeOffs, timesList]);

  if (currentDate.getDate() === 20) {
    // console.log("Ngày 20: ");
    // console.log("doctors: ", doctors);
    // console.log("rows: ", rows);
  }
  // console.log("timeOffs: ", timeOffs);

  const renderButton = (schedule) => {
    const bookings = schedule?.bookings;

    if (schedule.idDoctor === "353066b6-4bb7-4df8-8f46-88f71bf6a182") {
      // console.log("Sang schedule: ", schedule);
    }

    if (bookings.length > 0) {
      return <Button variant="outlined">{bookings[0]?.bookingStatus}</Button>;
    }
    return <Button variant="contained">Book</Button>;
  };

  const renderCols = (row) => {
    return timesList.map((time) => {
      const timeId = time?.id;
      const schedule = row.schedulesByTimeId[timeId];

      // console.log("schedule: ", schedule);
      // const isTimeOff = schedule?.isTimeOff;
      const isTimeOff = schedulesTimeOff[schedule?.id];

      return schedule ? (
        <TableCell
          key={timeId}
          sx={{
            border: "1px solid rgba(0,0,0,0.4)",
            p: 0,
            position: "relative",
            bgcolor: isTimeOff ? "rgba(255, 246, 143, 0.8)" : "inherit"
          }}
          align="center"
        >
          {/* {schedule.timeSchedule.timeStart} */}
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: 2,
              position: "relative"
            }}
          >
            {renderButton(schedule)}
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
            {t("today")}
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
            {rows.map((row) => {
              return (
                <TableRow key={row.id}>
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
                    {row?.name}
                  </TableCell>

                  {renderCols(row)}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

ScheduleList.propTypes = {
  timesList: PropTypes.array.isRequired
};

export default WithTimesLoaderWrapper(ScheduleList);
