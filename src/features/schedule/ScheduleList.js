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
  Typography
  // Card
} from "@mui/material";

import formatDate from "date-and-time";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useFetchingStore } from "../../store/FetchingApiStore";
import WithTimesLoaderWrapper from "./hocs/WithTimesLoaderWrapper";
import staffServices from "../../services/staffServices";
import { staffRoles } from "../../entities/Staff";
// import timeOffServices from "../../services/timeOffServices";
// import { createDateByDateAndTimeStr } from "../../utils/datetimeUtil";

// function filterDoctorsByDayOfWeek(doctors, timesList, currentDate, timeOffs) {
//   const timeListIds = Object.keys(timesList);

//   const timesListObj = timesList.reduce((result, time) => {
//     return {
//       ...result,
//       [time.id]: time
//     };
//   }, {});

//   const filteredDoctors = doctors.map((doctor) => {
//     const filteredSchedules = doctor.staffSchedules.filter((schedule) => {
//       return schedule.dayOfWeek === currentDate.getDay();
//     });

//     const schedulesByTimeId = filteredSchedules.reduce((result, schedule) => {
//       const temp = result[schedule.idTime] || [];

//       /*************************************************************************
//       // [schedule.idTime] là 1 array vì nếu có 2 schedule trùng timeId và dayOfWeek
//       // Nhưng applyFrom và applyTo đè lên nhau
//       // Nghĩa là current thuộc cả applyFrom và applyTo của 2 schedule trùng timeId và dayOfWeek
//       return {
//         ...result,
//         [schedule.idTime]: [...temp, schedule]
//       };

//       Tạm thời ta sẽ lấy phần tử 0 trước, sau này sẽ fix lại sau

//       *************************************************************************/

//       const currentScheduleTimeStart = createDateByDateAndTimeStr(currentDate, timesListObj[schedule.idTime].timeStart);
//       const currentScheduleTimeEnd = createDateByDateAndTimeStr(currentDate, timesListObj[schedule.idTime].timeEnd);

//       let isTimeOff = false;
//       timeOffs.forEach((timeOff) => {
//         const timeOffStart = createDateByDateAndTimeStr(new Date(timeOff.date), timeOff.timeStart);
//         const timeOffEnd = createDateByDateAndTimeStr(new Date(timeOff.date), timeOff.timeEnd);

//         if (isBetweenAndNoEqual(currentScheduleTimeStart, timeOffStart, timeOffEnd)) {
//           isTimeOff = true;
//         } else if (isBetweenAndNoEqual(currentScheduleTimeEnd, timeOffStart, timeOffEnd)) {
//           isTimeOff = true;
//         } else if (isBetweenAndNoEqual(timeOffStart, currentScheduleTimeStart, currentScheduleTimeEnd)) {
//           isTimeOff = true;
//         } else if (isBetweenAndNoEqual(timeOffEnd, currentScheduleTimeStart, currentScheduleTimeEnd)) {
//           isTimeOff = true;
//         }
//       });

//       const scheduleWithIfIsTimeOff = { ...schedule, isTimeOff };

//       return {
//         ...result,
//         [schedule.idTime]: [...temp, scheduleWithIfIsTimeOff]
//       };
//     }, {});

//     // console.log("schedulesByTimeId: ", schedulesByTimeId);

//     return { ...doctor, staffSchedules: [...filteredSchedules], schedulesByTimeId };
//   });
//   return filteredDoctors;
// }

function ScheduleList({ timesList }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const [doctors, setDoctors] = useState([]);

  // const [timeOffs, setTimeOffs] = useState([]);

  const { fetchApi } = useFetchingStore();

  const { t } = useTranslation("scheduleFeature", { keyPrefix: "ScheduleList" });

  // const loadTimeOffs = async (doctorId) => {
  //   const timeOffsOfDoctor = [];
  //   await fetchApi(async () => {
  //     const res = await timeOffServices.getTimeOffByDoctorId(doctorId, { from: currentDate, to: currentDate });
  //
  //     if (res.success) {
  //       const timeOffsData = res.timeOffs;
  //       // setTimeOffs(timeOffsData);
  //       timeOffsOfDoctor.push(timeOffsData);
  //       return { success: true, error: "" };
  //     }
  //     // setTimeOffs([]);
  //     return { success: false, error: res.message };
  //   });
  //
  //   return timeOffsOfDoctor;
  // };

  const loadAllTimeOffs = async () => {
    // const allTimeOffs = [];
    // for (const doctor of doctors) {
    //   const timeOffsOfDoctor = await loadTimeOffs(doctor.id);
    //   allTimeOffs.push({
    //     [doctor.id]: timeOffsOfDoctor
    //   });
    // }
    // setTimeOffs([]);
  };

  useEffect(() => {
    loadAllTimeOffs();
  }, [doctors]);

  const loadData = async () => {
    await fetchApi(async () => {
      const paramsObj = {
        role: staffRoles.ROLE_DOCTOR,
        limit: 200,
        from: currentDate,
        to: currentDate
      };
      const res = await staffServices.getStaffList(paramsObj);

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

  // const rows = useMemo(() => {
  //   // return filterDoctorsByDayOfWeek(doctors, timesList, currentDate, timeOffs);
  //   return [];
  // }, [doctors, timeOffs, timesList]);

  // console.log("doctors: ", doctors);
  // console.log("timeOffs: ", timeOffs);
  // console.log("rows: ", rows);

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
                  border: "1px solid rgba(0,0,0,0.2)"
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
          {/* <TableBody>
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
                  {timesList?.map((time) => {
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
          </TableBody> */}
        </Table>
      </TableContainer>
    </Box>
  );
}

ScheduleList.propTypes = {
  timesList: PropTypes.array.isRequired
};

export default WithTimesLoaderWrapper(ScheduleList);
