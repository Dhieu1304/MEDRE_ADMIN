import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { Box, Button, Checkbox, Grid, IconButton, ListItemText, MenuItem, Select, useTheme } from "@mui/material";
import { Add as AddIcon, RemoveCircle as RemoveCircleIcon } from "@mui/icons-material";
import CustomModal from "../../../components/CustomModal";

import { useFetchingStore } from "../../../store/FetchingApiStore";
import CustomInput from "../../../components/CustomInput/CustomInput";
import WithTimesLoaderWrapper from "../hocs/WithTimesLoaderWrapper";
import { scheduleDayOfWeeks, scheduleSessions, scheduleTypes } from "../../../entities/Schedule/constant";
import { useAppConfigStore } from "../../../store/AppConfigStore";
import scheduleServices from "../../../services/scheduleServices";
import CustomOverlay from "../../../components/CustomOverlay/CustomOverlay";

function AddScheduleModal({ show, setShow, data, setData, handleAfterAddSchedule }) {
  const { handleSubmit, watch, control, trigger, reset } = useForm({
    mode: "onChange",
    defaultValues: {
      applyFrom: "",
      applyTo: "",
      dataForm: [
        {
          type: "",
          expertise: "",
          session: "",
          repeatOn: []
        }
      ]
    },
    criteriaMode: "all"
  });

  const { t } = useTranslation("scheduleFeature", { keyPrefix: "AddScheduleModal" });
  const { t: tSchedule } = useTranslation("scheduleEntity", { keyPrefix: "properties" });
  const { t: tScheduleConstants } = useTranslation("scheduleEntity", { keyPrefix: "constants" });
  const { t: tInputValidate } = useTranslation("input", { keyPrefix: "validation" });

  const { isLoading, fetchApi } = useFetchingStore();
  const { locale } = useAppConfigStore();
  const theme = useTheme();

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

  const scheduleDayOfWeekListObj = useMemo(() => {
    return [
      {
        label: tScheduleConstants("daysOfWeek.sunday"),
        value: scheduleDayOfWeeks.SUNDAY
      },
      {
        label: tScheduleConstants("daysOfWeek.monday"),
        value: scheduleDayOfWeeks.MONDAY
      },
      {
        label: tScheduleConstants("daysOfWeek.tuesday"),
        value: scheduleDayOfWeeks.TUESDAY
      },
      {
        label: tScheduleConstants("daysOfWeek.wednesday"),
        value: scheduleDayOfWeeks.WEDNESDAY
      },
      {
        label: tScheduleConstants("daysOfWeek.thursday"),
        value: scheduleDayOfWeeks.THURSDAY
      },
      {
        label: tScheduleConstants("daysOfWeek.friday"),
        value: scheduleDayOfWeeks.FRIDAY
      },
      {
        label: tScheduleConstants("daysOfWeek.saturday"),
        value: scheduleDayOfWeeks.SATURDAY
      }
    ].reduce((obj, cur) => {
      return {
        ...obj,
        [cur?.value]: cur
      };
    }, {});
  }, [locale]);

  const expertiseListObj = useMemo(() => {
    return data?.expertises?.reduce((obj, cur) => {
      return {
        ...obj,
        [cur?.id]: cur
      };
    }, {});
  }, [data?.expertises]);

  const doctorId = data?.id;

  const handleAddSchedule = async ({ applyFrom, applyTo, dataForm }) => {
    // console.log({ doctorId, applyFrom, applyTo, dataForm });
    await fetchApi(async () => {
      const res = await scheduleServices.createSchedulesByDoctorId({ doctorId, applyFrom, applyTo, data: dataForm });
      if (res?.success) {
        setShow(false);
        setData({});
        if (handleAfterAddSchedule) await handleAfterAddSchedule();
        return { ...res };
      }
      return { ...res };
    });
  };

  return (
    <>
      <CustomOverlay open={isLoading} />
      <CustomModal
        show={show}
        setShow={setShow}
        data={data}
        setData={setData}
        title={t("title")}
        submitBtnLabel={t("button.save")}
        onSubmit={handleSubmit(handleAddSchedule)}
        width="80%"
      >
        <Box
          sx={{
            width: "100%",
            px: 2,
            py: 2,
            overflow: "scroll",
            maxHeight: 450
          }}
        >
          <Grid
            container
            spacing={3}
            sx={{
              mb: 2
            }}
          >
            <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
              <CustomInput
                control={control}
                rules={{
                  required: tInputValidate("required")
                }}
                label={tSchedule("applyFrom")}
                trigger={trigger}
                name="applyFrom"
                type="date"
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
              <CustomInput
                control={control}
                rules={{
                  required: `${tSchedule("applyTo")} ${tInputValidate("required")}`,
                  validate: (value) => {
                    const { applyFrom } = watch();
                    const applyTo = value;

                    if (applyFrom <= applyTo) {
                      return true;
                    }
                    return tInputValidate("gte", {
                      left: tSchedule("applyToLabel"),
                      right: tSchedule("applyFromLabel")
                    });
                  }
                }}
                label={tSchedule("applyTo")}
                trigger={trigger}
                name="applyTo"
                type="date"
                isCustomError
              />
            </Grid>
          </Grid>

          {watch().dataForm?.map((row, index) => {
            const keyIndex = `dataForm-${index}`;
            return (
              <Box
                key={keyIndex}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <Grid
                  container
                  spacing={3}
                  sx={{
                    mb: 2
                  }}
                >
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <CustomInput
                      control={control}
                      rules={{
                        required: tInputValidate("required")
                      }}
                      label={tSchedule("expertise")}
                      trigger={trigger}
                      name={`dataForm[${index}].expertise`}
                      type="select"
                    >
                      <Select
                        renderValue={(selected) => {
                          return expertiseListObj[selected].name;
                        }}
                      >
                        {Object.keys(expertiseListObj).map((key) => {
                          const item = expertiseListObj[key];

                          return (
                            <MenuItem key={item?.id} value={item?.id}>
                              <Checkbox checked={watch().dataForm[index].expertise === item?.id} />
                              <ListItemText primary={item?.name} />
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </CustomInput>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <CustomInput
                      control={control}
                      rules={{
                        required: tInputValidate("required")
                      }}
                      label={tSchedule("type")}
                      trigger={trigger}
                      name={`dataForm[${index}].type`}
                      type="select"
                    >
                      <Select
                        renderValue={(selected) => {
                          return scheduleTypeListObj[selected].label;
                        }}
                      >
                        {Object.keys(scheduleTypeListObj).map((key) => {
                          const item = scheduleTypeListObj[key];

                          return (
                            <MenuItem key={item?.value} value={item?.value}>
                              <Checkbox checked={watch().dataForm[index].type === item?.value} />
                              <ListItemText primary={item?.label} />
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </CustomInput>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <CustomInput
                      control={control}
                      rules={{
                        required: tInputValidate("required")
                      }}
                      label={tSchedule("session")}
                      trigger={trigger}
                      name={`dataForm[${index}].session`}
                      type="select"
                    >
                      <Select
                        renderValue={(selected) => {
                          return scheduleSessionListObj[selected].label;
                        }}
                      >
                        {Object.keys(scheduleSessionListObj).map((key) => {
                          const item = scheduleSessionListObj[key];

                          return (
                            <MenuItem key={item?.value} value={item?.value}>
                              <Checkbox checked={watch().dataForm[index].session === item?.value} />
                              <ListItemText primary={item?.label} />
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </CustomInput>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <CustomInput
                      control={control}
                      rules={{
                        required: tInputValidate("required")
                      }}
                      label={tSchedule("repeatOn")}
                      trigger={trigger}
                      name={`dataForm[${index}].repeatOn`}
                      type="select"
                    >
                      <Select
                        multiple
                        renderValue={(selected) => {
                          if (Array.isArray(selected))
                            return selected
                              ?.map((cur) => {
                                return scheduleDayOfWeekListObj[cur]?.label;
                              })
                              ?.join(", ");
                          return selected;
                        }}
                      >
                        {Object.keys(scheduleDayOfWeekListObj).map((key) => {
                          const item = scheduleDayOfWeekListObj[key];

                          return (
                            <MenuItem key={item?.value} value={item?.value}>
                              <Checkbox checked={watch().dataForm[index].repeatOn?.indexOf(item?.value) > -1} />
                              <ListItemText primary={item?.label} />
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </CustomInput>
                  </Grid>
                </Grid>

                {watch().dataForm?.length > 1 && (
                  <IconButton
                    onClick={() => {
                      const newData = [...watch().dataForm];
                      newData.splice(index, 1);

                      reset({
                        ...watch(),
                        dataForm: [...newData]
                      });
                    }}
                  >
                    <RemoveCircleIcon
                      sx={{
                        transform: "translateY(-50%)",
                        color: theme.palette.error.light
                      }}
                    />
                  </IconButton>
                )}
              </Box>
            );
          })}

          <Button
            variant="contained"
            sx={{
              backgroundColor: theme.palette.success.light
            }}
            startIcon={
              <AddIcon
                sx={{
                  color: theme.palette.success.contrastText
                }}
              />
            }
            onClick={() => {
              reset({
                ...watch(),
                dataForm: [
                  ...watch().dataForm,
                  {
                    type: "",
                    expertise: "",
                    session: "",
                    repeatOn: []
                  }
                ]
              });
            }}
          >
            {t("button.addRow")}
          </Button>
        </Box>
      </CustomModal>
    </>
  );
}

AddScheduleModal.defaultProps = {
  handleAfterAddSchedule: undefined
};

AddScheduleModal.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  setData: PropTypes.func.isRequired,
  handleAfterAddSchedule: PropTypes.func
};

export default WithTimesLoaderWrapper(AddScheduleModal);
