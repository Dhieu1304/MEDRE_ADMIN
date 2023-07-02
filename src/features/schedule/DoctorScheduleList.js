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
import { Add as AddIcon, RemoveCircle as RemoveCircleIcon } from "@mui/icons-material";
// import WithDoctorLoaderWrapper from "../staff/hocs/WithDoctorLoaderWrapper";
import { useFetchingStore } from "../../store/FetchingApiStore";
import { normalizeStrToDateStr } from "../../utils/standardizedForForm";
import { getWeekByDate } from "../../utils/datetimeUtil";
import { CustomDateFromToInput } from "../../components/CustomInput";
import { useAppConfigStore } from "../../store/AppConfigStore";
import { useCustomModal } from "../../components/CustomModal";
import scheduleServices from "../../services/scheduleServices";
import CustomModal from "../../components/CustomModal/CustomModal";
import { scheduleActionAbility } from "../../entities/Schedule/constant";
import CustomInput from "../../components/CustomInput/CustomInput";
import AddScheduleModal from "./components/AddScheduleModal";
import {
  useScheduleSessionsContantTranslation,
  useScheduleTypesContantTranslation
} from "./hooks/useScheduleConstantsTranslation";
import Schedule from "../../entities/Schedule/Schedule";
import { Can } from "../../store/AbilityStore";
import CustomPageTitle from "../../components/CustomPageTitle";

function DoctorScheduleList({ staff }) {
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

  const selectScheduleForm = useForm({
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
  const deleteScheduleModal = useCustomModal();
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

  const [, scheduleTypeContantListObj] = useScheduleTypesContantTranslation();

  const [, scheduleSessionContantListObj] = useScheduleSessionsContantTranslation();

  const resetSelectScheduleForm = (schedulesData, value = false) => {
    const scheduleIdsObj = schedulesData.reduce((result, schedule) => {
      return {
        ...result,
        [schedule?.id]: value
      };
    }, {});

    //
    selectScheduleForm.reset({
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
      const staffId = staff?.id;
      const res = await scheduleServices.getScheduleListByDoctorId(staffId, from, to);
      let schedulesData = [];
      //
      if (res.success) {
        schedulesData = res?.schedules || [];
        resetSelectScheduleForm(schedulesData);
        setSchedules(schedulesData);
        return { ...res };
      }
      setSchedules([]);
      return { ...res };
    });
  };

  useEffect(() => {
    loadData();
  }, [filterForm.watch().from, filterForm.watch().to]);

  const handleChangeApplyEnd = async ({ scheduleIdsObj, applyTo }) => {
    // console.log({ scheduleIdsObj, applyTo });
    const scheduleIds = Object.keys(scheduleIdsObj).filter((key) => scheduleIdsObj[key] && key);

    await fetchApi(async () => {
      const res = await scheduleServices.changeApplyToScheduleByScheduleIds({ scheduleIds, applyTo });

      if (res?.success) {
        changeApplyToModal.setShow(false);
        changeApplyToModal.setData({});

        await loadData();
        return { ...res };
      }

      changeApplyToModal.setShow(false);
      changeApplyToModal.setData({});
      return { ...res };
    });
  };

  const handleDeleteSchedule = async ({ scheduleIdsObj }) => {
    // console.log({ scheduleIdsObj });
    const scheduleIds = Object.keys(scheduleIdsObj).filter((key) => scheduleIdsObj[key] && key);

    await fetchApi(async () => {
      const res = await scheduleServices.deleteSchedulesByScheduleIds({ scheduleIds });

      if (res?.success) {
        deleteScheduleModal.setShow(false);
        deleteScheduleModal.setData({});

        await loadData();
        return { ...res };
      }

      deleteScheduleModal.setShow(false);
      deleteScheduleModal.setData({});
      return { ...res };
    });
  };

  const handleAfterAddSchedule = async () => {
    await loadData();
  };

  return (
    <>
      <Box>
        <CustomPageTitle
          title={t("title")}
          right={
            <Can I={scheduleActionAbility.ADD} a={Schedule.magicWord()}>
              <Button
                variant="contained"
                onClick={() => {
                  addScheduleModal.setShow(true);
                  addScheduleModal.setData(staff);
                }}
                endIcon={<AddIcon fontSize="large" />}
                sx={{
                  bgcolor: theme.palette.success.light
                }}
              >
                {t("button.addSchedule")}
              </Button>
            </Can>
          }
        />

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
                alignItems: "center",
                mt: {
                  xs: 2,
                  md: 0
                }
              }}
            >
              <Can I={scheduleActionAbility.UPDATE} a={Schedule.magicWord()}>
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
              </Can>

              <Can I={scheduleActionAbility.DELETE} a={Schedule.magicWord()}>
                <Button
                  variant="contained"
                  onClick={() => {
                    deleteScheduleModal.setShow(true);
                  }}
                  endIcon={<RemoveCircleIcon fontSize="large" />}
                  sx={{
                    bgcolor: theme.palette.error.light,
                    ml: 2
                  }}
                >
                  {t("button.delete")}
                </Button>
              </Can>
            </Box>
          )}
        </Grid>

        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <Can I={scheduleActionAbility.UPDATE} a={Schedule.magicWord()}>
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

                        resetSelectScheduleForm(schedules, checked);
                      }}
                    />
                  </TableCell>
                </Can>

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
                    <Can I={scheduleActionAbility.UPDATE} a={Schedule.magicWord()}>
                      <TableCell
                        align="center"
                        style={{ width: 10 }}
                        sx={{
                          fontWeight: 600
                        }}
                      >
                        <Controller
                          name={`scheduleIdsObj.${schedule?.id}`}
                          control={selectScheduleForm.control}
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
                    </Can>
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
                      {scheduleSessionContantListObj[schedule?.session]?.label}
                    </TableCell>
                    <TableCell align="left" sx={{ display: "table-cell" }}>
                      {schedule?.scheduleExpertise?.name}
                    </TableCell>
                    <TableCell align="left" sx={{ display: "table-cell" }}>
                      {scheduleTypeContantListObj[schedule?.type]?.label}
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
          onSubmit={selectScheduleForm.handleSubmit(handleChangeApplyEnd)}
        >
          <CustomInput
            control={selectScheduleForm.control}
            rules={{
              required: tInputValidate("required")
            }}
            label={tSchedule("applyTo")}
            trigger={selectScheduleForm.trigger}
            name="applyTo"
            type="date"
          />
        </CustomModal>
      )}

      {deleteScheduleModal && (
        <CustomModal
          title={t("deleteScheduleModal.title")}
          submitBtnLabel={t("deleteScheduleModal.button.save")}
          show={deleteScheduleModal.show}
          setShow={deleteScheduleModal.setShow}
          onSubmit={selectScheduleForm.handleSubmit(handleDeleteSchedule)}
        >
          <Box>
            <Typography>{t("deleteScheduleModal.question")}</Typography>
          </Box>
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
  staff: PropTypes.object.isRequired
};

// export default WithDoctorLoaderWrapper(DoctorScheduleList);
export default DoctorScheduleList;

// const DoctorScheduleList = () => {
//   return <div>DoctorScheduleList</div>;
// };

// export default DoctorScheduleList;
