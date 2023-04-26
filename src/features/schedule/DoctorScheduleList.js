import { Controller, useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme
} from "@mui/material";
import formatDate from "date-and-time";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { Add as AddIcon } from "@mui/icons-material";
import { toast } from "react-toastify";
import WithDoctorLoaderWrapper from "../staff/hocs/WithDoctorLoaderWrapper";
import { useFetchingStore } from "../../store/FetchingApiStore";
import { normalizeStrToDateStr } from "../../utils/standardizedForForm";
import { getWeekByDate } from "../../utils/datetimeUtil";
import { CustomDateFromToInput } from "../../components/CustomInput";
import { useAppConfigStore } from "../../store/AppConfigStore";
import { useCustomModal } from "../../components/CustomModal";
import scheduleServices from "../../services/scheduleServices";
import CustomModal from "../../components/CustomModal/CustomModal";
import { scheduleSessions, scheduleTypes } from "../../entities/Schedule/constant";
import CustomInput from "../../components/CustomInput/CustomInput";
import AddScheduleModal from "./components/AddScheduleModal";

function DoctorScheduleList({ doctor, doctorId }) {
  const [schedules, setSchedules] = useState([]);

  const [checkedCount, setCheckedCount] = useState(0);

  const week = useMemo(() => {
    return getWeekByDate();
  }, []);

  const filterForm = useForm({
    mode: "onChange",
    defaultValues: {
      from: normalizeStrToDateStr(week[0]),
      to: normalizeStrToDateStr(week[6]),
      page: 1,
      limit: 10
    },
    criteriaMode: "all"
  });

  const changeApplyTimeForm = useForm({
    mode: "onChange",
    defaultValues: {
      scheduleIdsObj: {},

      applyTo: ""
    },
    criteriaMode: "all"
  });

  const { fetchApi } = useFetchingStore();
  const { locale } = useAppConfigStore();

  const theme = useTheme();

  const { t } = useTranslation("scheduleFeature", { keyPrefix: "DoctorScheduleList" });
  const { t: tSchedule } = useTranslation("scheduleEntity", { keyPrefix: "properties" });
  const { t: tScheduleConstants } = useTranslation("scheduleEntity", { keyPrefix: "constants" });
  const { t: tInputValidate } = useTranslation("input", { keyPrefix: "validation" });

  const changeApplyToModal = useCustomModal();
  const addScheduleModal = useCustomModal();

  const daysOfWeek = useMemo(
    () => [
      tScheduleConstants("daysOfWeek.sunday"),
      tScheduleConstants("daysOfWeek.monday"),
      tScheduleConstants("daysOfWeek.tuesday"),
      tScheduleConstants("daysOfWeek.wednesday"),
      tScheduleConstants("daysOfWeek.thursday"),
      tScheduleConstants("daysOfWeek.friday"),
      tScheduleConstants("daysOfWeek.saturday")
    ],
    [locale]
  );

  const columns = useMemo(
    () => [
      {
        id: "repeatOn",
        label: tSchedule("repeatOn"),
        minWidth: 100
      },
      {
        id: "session",
        label: tSchedule("session"),
        minWidth: 100
      },
      {
        id: "expertise",
        label: tSchedule("expertise"),
        minWidth: 100
      },
      {
        id: "type",
        label: tSchedule("type"),
        minWidth: 100
      },
      {
        id: "applyTime",
        label: tSchedule("applyTime"),
        minWidth: 100
      }
    ],
    [locale]
  );

  const scheduleTypeListObj = useMemo(() => {
    return [
      {
        label: tScheduleConstants("types.offline"),
        value: scheduleTypes.TYPE_OFFLINE
      },
      {
        label: tScheduleConstants("types.online"),
        value: scheduleTypes.TYPE_ONLINE
      }
    ].reduce((obj, cur) => {
      return {
        ...obj,
        [cur?.value]: cur
      };
    }, {});
  }, [locale]);

  const scheduleSessionListObj = useMemo(() => {
    return [
      {
        label: tScheduleConstants("sessions.morning"),
        value: scheduleSessions.MORNING
      },
      {
        label: tScheduleConstants("sessions.afternoon"),
        value: scheduleSessions.AFFTERNOON
      }
    ].reduce((obj, cur) => {
      return {
        ...obj,
        [cur?.value]: cur
      };
    }, {});
  }, [locale]);

  const resetChangeApplyTimeForm = (schedulesData, value = false) => {
    const scheduleIdsObj = schedulesData.reduce((result, schedule) => {
      return {
        ...result,
        [schedule?.id]: value
      };
    }, {});

    //
    changeApplyTimeForm.reset({
      scheduleIdsObj,
      applyTo: ""
    });

    if (value) {
      setCheckedCount(schedules?.length);
    } else {
      setCheckedCount(0);
    }
  };

  const loadData = async () => {
    const { from, to } = filterForm.watch();

    await fetchApi(async () => {
      const res = await scheduleServices.getScheduleListByDoctorId(doctorId, from, to);
      let schedulesData = [];
      //
      if (res.success) {
        schedulesData = res?.schedules || [];
        resetChangeApplyTimeForm(schedulesData);
        setSchedules(schedulesData);
        return { success: true };
      }
      setSchedules([]);
      return { error: res.message };
    });
  };

  useEffect(() => {
    loadData();
  }, [filterForm.watch().from, filterForm.watch().to]);

  // const schedulesGroupByApplyTime = useMemo(() => {
  //   // group schedules by applyTime
  //   return schedules.reduce((acc, schedule) => {
  //     const applyTime = schedule?.applyFrom + " → " + schedule?.applyTo;
  //     return acc[applyTime]
  //       ? {
  //           ...acc,
  //           [applyTime]: [...acc[applyTime], schedule]
  //         }
  //       : {
  //           ...acc,
  //           [applyTime]: [schedule]
  //         };
  //   }, {});
  // }, [schedules]);

  // console.log("rows: ", rows);

  const handleChangeApplyEnd = async ({ scheduleIdsObj, applyTo }) => {
    // console.log({ scheduleIdsObj, applyTo });
    const scheduleIds = Object.keys(scheduleIdsObj).filter((key) => scheduleIdsObj[key] && key);

    await fetchApi(async () => {
      const res = await scheduleServices.changeApplyToScheduleByScheduleIds({ doctorId, scheduleIds, applyTo });

      if (res?.success) {
        changeApplyToModal.setShow(false);
        changeApplyToModal.setData({});
        await loadData();
        return { success: true };
      }
      toast(res.message);
      changeApplyToModal.setShow(false);
      changeApplyToModal.setData({});
      return { error: res.message };
    });
  };

  const handleAfterAddSchedule = async () => {
    await loadData();
  };

  return (
    <>
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <Typography variant="h4" sx={{ mb: 4 }}>
            {t("title")}
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              addScheduleModal.setShow(true);
              addScheduleModal.setData(doctor);
            }}
            endIcon={<AddIcon fontSize="large" />}
            sx={{
              bgcolor: theme.palette.success.light
            }}
          >
            {t("button.addSchedule")}
          </Button>
        </Box>
        <Grid
          container
          spacing={3}
          justifyContent="space-between"
          sx={{
            mb: 4
          }}
        >
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <CustomDateFromToInput
              watchMainForm={filterForm.watch}
              setMainFormValue={filterForm.setValue}
              label={t("filter.dateRange")}
              fromDateName="from"
              fromDateRules={{}}
              toDateName="to"
              toDateRules={{}}
              fromDateLabel={t("filter.from")}
              toDateLabel={t("filter.to")}
            />
          </Grid>

          {checkedCount > 0 && schedules?.length > 0 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <Button
                variant="contained"
                sx={{
                  ml: 2
                }}
                onClick={() => {
                  changeApplyToModal.setShow(true);
                }}
              >
                {t("button.editAll")}
              </Button>
            </Box>
          )}
        </Grid>

        {/* {Object.keys(schedulesGroupByApplyTime).map((key) => {
          const schedules = schedulesGroupByApplyTime[key];
          const applyFrom = key.split("→")[0];
          const applyTo = key.split("→")[1];

          const applyFromString = formatDate.format(
            // new Date(applyFrom.split("-")[0], applyFrom.split("-")[1], applyFrom.split("-")[2]),
            new Date(...applyFrom.split("-")),
            "DD/MM/YYYY"
          );
          const applyToString = formatDate.format(
            // new Date(applyTo.split("-")[0], applyTo.split("-")[1], applyTo.split("-")[2]),
            new Date(...applyTo.split("-")),
            "DD/MM/YYYY"
          );

          const applyTimeString = applyFromString + " → " + applyToString;

          return (
            <Box
              sx={{
                mb: 2
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  mb: 2,
                  fontWeight: "600"
                }}
              >
                {applyTimeString}
              </Typography>

            </Box>
          );
        })} */}

        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  align="center"
                  style={{ width: 10 }}
                  sx={{
                    fontWeight: 600
                  }}
                >
                  <Checkbox
                    checked={checkedCount === schedules.length}
                    onChange={(e) => {
                      const { checked } = e.target;

                      resetChangeApplyTimeForm(schedules, checked);
                    }}
                  />
                </TableCell>

                {columns?.map((column) => {
                  return (
                    <TableCell
                      key={column.id}
                      align="left"
                      style={{ minWidth: column.minWidth }}
                      sx={{
                        fontWeight: 600
                      }}
                    >
                      {column.label}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {schedules.map((schedule) => {
                return (
                  <TableRow key={schedule?.id}>
                    <TableCell
                      align="center"
                      style={{ width: 10 }}
                      sx={{
                        fontWeight: 600
                      }}
                    >
                      <Controller
                        name={`scheduleIdsObj.${schedule?.id}`}
                        control={changeApplyTimeForm.control}
                        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                          <Checkbox
                            onBlur={onBlur}
                            value={value}
                            error={error}
                            checked={value}
                            onChange={(e) => {
                              const { checked } = e.target;

                              setCheckedCount((count) => count + (checked ? 1 : -1));
                              onChange(e);
                            }}
                            name={schedule?.id}
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell component="th" scope="row" sx={{ display: "table-cell" }}>
                      {schedule?.repeatOn
                        ?.split(",")
                        .map(Number)
                        .map((dayOfWeek) => {
                          return daysOfWeek[dayOfWeek];
                        })
                        .join(", ")}
                    </TableCell>
                    <TableCell align="left" sx={{ display: "table-cell" }}>
                      {scheduleSessionListObj[schedule?.session].label}
                    </TableCell>
                    <TableCell align="left" sx={{ display: "table-cell" }}>
                      {schedule?.scheduleExpertise?.name}
                    </TableCell>
                    <TableCell align="left" sx={{ display: "table-cell" }}>
                      {scheduleTypeListObj[schedule?.type].label}
                    </TableCell>
                    <TableCell align="left" sx={{ display: "table-cell" }}>
                      {formatDate.format(new Date(schedule?.applyFrom), "DD/MM/YYYY")}
                      &rarr;
                      {formatDate.format(new Date(schedule?.applyTo), "DD/MM/YYYY")}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {changeApplyToModal && (
        <CustomModal
          title={t("changeApplyTimeModal.title")}
          submitBtnLabel={t("changeApplyTimeModal.button.save")}
          show={changeApplyToModal.show}
          setShow={changeApplyToModal.setShow}
          onSubmit={changeApplyTimeForm.handleSubmit(handleChangeApplyEnd)}
        >
          <CustomInput
            control={changeApplyTimeForm.control}
            rules={{
              required: tInputValidate("required")
            }}
            label={tSchedule("applyTo")}
            trigger={changeApplyTimeForm.trigger}
            name="applyTo"
            type="date"
          />
        </CustomModal>
      )}

      {addScheduleModal.show && (
        <AddScheduleModal
          show={addScheduleModal.show}
          setShow={addScheduleModal.setShow}
          data={addScheduleModal.data}
          setData={addScheduleModal.setData}
          handleAfterAddSchedule={handleAfterAddSchedule}
        />
      )}
    </>
  );
}

DoctorScheduleList.propTypes = {
  doctor: PropTypes.object.isRequired,
  doctorId: PropTypes.string.isRequired
};

export default WithDoctorLoaderWrapper(DoctorScheduleList);

// const DoctorScheduleList = () => {
//   return <div>DoctorScheduleList</div>;
// };

// export default DoctorScheduleList;
