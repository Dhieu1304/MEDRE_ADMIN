import PropTypes from "prop-types";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { WithDoctorLoaderWrapper } from "../staff/hocs";
import WithTimesLoaderWrapper from "./hocs/WithTimesLoaderWrapper";
import { useAppConfigStore } from "../../store/AppConfigStore";
import { scheduleTypes } from "../../entities/Schedule/constant";
import { CustomDateFromToInput } from "../../components/CustomInput";
import { useFetchingStore } from "../../store/FetchingApiStore";
import routeConfig from "../../config/routeConfig";
import { staffDetailRoutes } from "../../pages/StaffPage/routes";
import scheduleServices from "../../services/scheduleServices";

function AddDoctorSchedule({ timesList, doctor }) {
  const { locale } = useAppConfigStore();
  const navigate = useNavigate();

  const { t } = useTranslation("scheduleFeature", { keyPrefix: "AddDoctorSchedule" });
  const { t: tScheduleConstants } = useTranslation("scheduleEntity", { keyPrefix: "constants" });

  const { fetchApi } = useFetchingStore();

  const { watch, reset, control, handleSubmit, setValue } = useForm({
    defaultValues: {
      schedulesData: [],
      applyFrom: "2025-04-06",
      applyTo: "2025-08-25"
    }
  });

  const scheduleTypesListObj = useMemo(() => {
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

  useEffect(() => {
    const schedulesData = timesList.map((time) => {
      return Array.from({ length: 7 }, (_, index) => {
        return {
          dayOfWeek: index,
          timeId: time?.id,
          type: ""
        };
      });
    });

    reset({ schedulesData, applyFrom: "2025-04-06", applyTo: "2025-08-25" });
  }, [timesList]);

  // console.log("watch(): ", watch());

  const handleAddSchedules = async ({ schedulesData, applyFrom, applyTo }) => {
    const data = schedulesData.reduce((result, row) => {
      return [
        ...result,
        ...row.filter((col) => {
          return col.type !== "";
        })
      ];
    }, []);

    const doctorId = doctor?.id;

    await fetchApi(async () => {
      const res = await scheduleServices.createSchedulesByDoctorId({ doctorId, applyFrom, applyTo, data });

      if (res.success) {
        toast(res.message);
        const path = `${routeConfig.staff}/${doctorId}${staffDetailRoutes.calendar}?date=${applyFrom}`;
        navigate(path);

        return { success: true, error: "" };
      }
      toast(res.message);
      return { success: false, error: res.message };
    });

    // console.log("schedules: ", schedules);
  };
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        {t("title")}
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Card
          sx={{
            height: "100%",
            maxWidth: 500,
            display: "flex",
            flexDirection: "column",
            p: 0,
            cursor: "pointer",
            border: "none",
            boxShadow: "none"
          }}
        >
          <CardHeader
            avatar={<Avatar alt={doctor?.name} src={doctor?.image} />}
            title={<Typography variant="h6">{doctor?.name}</Typography>}
            subheader={doctor?.certificate && `(${doctor?.certificate})`}
          />
        </Card>

        <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
          <CustomDateFromToInput
            watchMainForm={watch}
            setMainFormValue={setValue}
            label={t("form.dateRange")}
            fromDateName="applyFrom"
            fromDateRules={{}}
            toDateName="applyTo"
            toDateRules={{}}
            fromDateLabel={t("form.applyFrom")}
            toDateLabel={t("form.applyTo")}
          />
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", ml: 2 }}>
            <Button variant="contained" onClick={handleSubmit(handleAddSchedules)}>
              {t("button.save")}
            </Button>
          </Box>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                align="center"
                style={{ width: 120 }}
                sx={{
                  border: "1px solid rgba(0,0,0,0.2)",
                  fontWeight: "600",
                  width: 120
                }}
              />

              {daysOfWeek?.map((dayOfWeek) => {
                return (
                  <TableCell
                    key={dayOfWeek}
                    align="left"
                    sx={{
                      border: "1px solid rgba(0,0,0,0.2)",
                      fontWeight: "600",
                      width: 120
                    }}
                  >
                    {dayOfWeek}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {timesList.map((time, index) => {
              return (
                <TableRow key={time?.id}>
                  <TableCell
                    sx={{
                      border: "1px solid rgba(0,0,0,0.2)",
                      fontWeight: "600",
                      width: 120
                    }}
                    component="th"
                    scope="row"
                  >
                    {`${timesList[index]?.timeStart?.split(":")[0]}:${timesList[index]?.timeStart?.split(":")[1]}`} -{" "}
                    {`${timesList[index]?.timeEnd?.split(":")[0]}:${timesList[index]?.timeEnd?.split(":")[1]}`}
                  </TableCell>

                  {daysOfWeek?.map((dayOfWeek, dayOfWeekIndex) => {
                    if (watch().schedulesData[index]) {
                      return (
                        <TableCell
                          key={dayOfWeek}
                          align="left"
                          sx={{
                            border: "1px solid rgba(0,0,0,0.2)",
                            fontWeight: "600",
                            width: 120
                          }}
                        >
                          <Box display="flex" flexDirection="column">
                            <Controller
                              name={`schedulesData.[${index}][${dayOfWeekIndex}].type`}
                              control={control}
                              render={({ field: { onChange, onBlur, value } }) => {
                                return (
                                  <RadioGroup value={value} onBlur={onBlur} onChange={onChange}>
                                    <Box display="flex" flexDirection="column">
                                      <FormControlLabel
                                        control={
                                          <Radio onBlur={onBlur} onChange={onChange} value={scheduleTypes.TYPE_OFFLINE} />
                                        }
                                        label={scheduleTypesListObj[scheduleTypes.TYPE_OFFLINE].label}
                                      />
                                      <FormControlLabel
                                        control={
                                          <Radio onBlur={onBlur} onChange={onChange} value={scheduleTypes.TYPE_ONLINE} />
                                        }
                                        label={scheduleTypesListObj[scheduleTypes.TYPE_ONLINE].label}
                                      />
                                    </Box>
                                  </RadioGroup>
                                );
                              }}
                            />

                            {/* <FormControlLabel
                            control={
                              <Checkbox
                                name={scheduleTypes.TYPE_OFFLINE}
                                checked={watch().schedulesData[index][dayOfWeek]?.type === scheduleTypes.TYPE_OFFLINE}
                              />
                            }
                            label={scheduleTypesListObj[scheduleTypes.TYPE_OFFLINE].label}
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                name={scheduleTypes.TYPE_ONLINE}
                                checked={watch().schedulesData[index][dayOfWeek]?.type === scheduleTypes.TYPE_ONLINE}
                              />
                            }
                            label={scheduleTypesListObj[scheduleTypes.TYPE_ONLINE].label}
                          /> */}
                          </Box>
                        </TableCell>
                      );
                    }
                    return (
                      <TableCell
                        key={dayOfWeek}
                        align="left"
                        sx={{
                          border: "1px solid rgba(0,0,0,0.2)",
                          fontWeight: "600",
                          width: 120
                        }}
                      />
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

AddDoctorSchedule.propTypes = {
  timesList: PropTypes.array.isRequired,
  doctor: PropTypes.object.isRequired
};

export default WithTimesLoaderWrapper(WithDoctorLoaderWrapper(AddDoctorSchedule));
