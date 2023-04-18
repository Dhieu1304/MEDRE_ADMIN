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
  Typography
} from "@mui/material";
import formatDate from "date-and-time";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import WithDoctorLoaderWrapper from "../staff/hocs/WithDoctorLoaderWrapper";
import { useFetchingStore } from "../../store/FetchingApiStore";
import { normalizeStrToDateStr } from "../../utils/standardizedForForm";
import { getWeekByDate } from "../../utils/datetimeUtil";
import { CustomDateFromToInput } from "../../components/CustomInput";
import { useAppConfigStore } from "../../store/AppConfigStore";
import { useCustomModal } from "../../components/CustomModal";
import scheduleServices from "../../services/scheduleServices";
import CustomModal from "../../components/CustomModal/CustomModal";

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
      applyFrom: "",
      applyTo: ""
    },
    criteriaMode: "all"
  });

  const { fetchApi } = useFetchingStore();
  const { locale } = useAppConfigStore();

  const { t } = useTranslation("scheduleFeature", { keyPrefix: "DoctorScheduleList" });
  const { t: tSchedule } = useTranslation("scheduleEntity", { keyPrefix: "properties" });
  const { t: tScheduleConstants } = useTranslation("scheduleEntity", { keyPrefix: "constants" });

  const changeApplyTimeModal = useCustomModal();

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
        id: "date",
        label: tSchedule("dayOfWeek"),
        minWidth: 100
      },
      {
        id: "timeSchedule",
        label: tSchedule("timeSchedule"),
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
      applyFrom: "",
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

  const handleChangeApplyTime = async ({ scheduleIdsObj, applyFrom, applyTo }) => {
    const scheduleIds = Object.keys(scheduleIdsObj).filter((key) => scheduleIdsObj[key] && key);
    await scheduleServices.changeApplyTimeScheduleByScheduleIds(doctor.id, { scheduleIds, applyFrom, applyTo });
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
        </Box>
        <Grid container spacing={3} justifyContent="space-between">
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
                  changeApplyTimeModal.setShow(true);
                }}
              >
                {t("button.editAll")}
              </Button>
            </Box>
          )}
        </Grid>

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
                      {daysOfWeek[schedule?.dayOfWeek]}
                    </TableCell>
                    <TableCell align="left" sx={{ display: "table-cell" }}>
                      {schedule?.timeSchedule?.timeStart} &rarr; {schedule?.timeSchedule?.timeEnd}
                    </TableCell>
                    <TableCell align="left" sx={{ display: "table-cell" }}>
                      {schedule?.type}
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

      {changeApplyTimeModal && (
        <CustomModal
          title={t("changeApplyTimeModal.title")}
          submitBtnLabel={t("changeApplyTimeModal.button.save")}
          show={changeApplyTimeModal.show}
          setShow={changeApplyTimeModal.setShow}
          onSubmit={changeApplyTimeForm.handleSubmit(handleChangeApplyTime)}
        >
          <CustomDateFromToInput
            watchMainForm={changeApplyTimeForm.watch}
            setMainFormValue={changeApplyTimeForm.setValue}
            label={t("changeApplyTimeModal.dateRange")}
            fromDateName="applyFrom"
            fromDateRules={{}}
            toDateName="applyTo"
            toDateRules={{}}
            fromDateLabel={t("changeApplyTimeModal.applyFrom")}
            toDateLabel={t("changeApplyTimeModal.applyTo")}
          />
        </CustomModal>
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
