import { useEffect, useMemo, useState } from "react";
import formatDate from "date-and-time";
import { Box, Button, Grid, InputAdornment, Menu, Switch, Typography } from "@mui/material";
import { CalendarToday as CalendarTodayIcon } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import CustomInput from "./CustomInput";

function CustomDateFromToInput({
  // control,
  // watch,
  // trigger
  label,
  watchMainForm,
  setMainFormValue,
  fromDateName,
  fromDateRules,
  toDateName,
  toDateRules,
  fromDateLabel,
  toDateLabel,
  haveTime
}) {
  const [preview, setPreview] = useState("");
  const [showMenu, setShowMenu] = useState(null);
  const [showTime, setShowTime] = useState(haveTime);

  const defaultValues = useMemo(() => {
    return {
      fromDate: watchMainForm(fromDateName),
      toDate: watchMainForm(toDateName),
      startTime: "",
      endTime: ""
    };
  }, []);

  const { control, trigger, watch, handleSubmit } = useForm({
    mode: "onChange",
    defaultValues,
    criteriaMode: "all"
  });

  const formatDateAndTime = ({ fromDate, toDate, startTime, endTime }) => {
    const fromDateStr = fromDate ? formatDate.format(new Date(fromDate), "DD/MM/YYYY") : "";
    const toDateStr = toDate ? formatDate.format(new Date(toDate), "DD/MM/YYYY") : "";
    let str = "";
    if (fromDateStr && toDateStr) {
      if (
        new Date(fromDate).getDate() === new Date(toDate).getDate() &&
        new Date(fromDate).getMonth() === new Date(toDate).getMonth() &&
        new Date(fromDate).getFullYear() === new Date(toDate).getFullYear()
      ) {
        if (showTime) {
          let strTime = "";
          if (startTime && endTime) {
            strTime = `${startTime} \u2192 ${endTime}`;
          } else {
            strTime = `${startTime}${endTime}`;
          }
          str = `${fromDateStr} ${strTime}`;
        } else {
          str = `${fromDateStr}`;
        }
      } else if (showTime) {
        str = `${fromDateStr} ${startTime} \u2192 ${toDateStr} ${endTime}`;
      } else {
        str = `${fromDateStr} \u2192 ${toDateStr}`;
      }
    } else if (showTime) {
      if (fromDateStr) {
        str = `${fromDateStr} ${startTime}`;
      } else if (toDateStr) {
        str = `${toDateStr} ${endTime}`;
      } else {
        str = "";
      }
    }

    return str;
  };

  const [fromToValue, setFromToValue] = useState(formatDateAndTime(defaultValues));

  useEffect(() => {
    const newPreview = formatDateAndTime(watch());
    setPreview(newPreview);
  }, [watch()]);

  const handleFormDateSubmit = ({ fromDate, toDate, startTime, endTime }) => {
    setMainFormValue(fromDateName, fromDate);
    setMainFormValue(toDateName, toDate);

    const str = formatDateAndTime({ fromDate, toDate, startTime, endTime });

    setFromToValue(str);
    setShowMenu(null);
  };

  return (
    <>
      <CustomInput
        control={control}
        rules={{}}
        label={label}
        trigger={trigger}
        noNameValue={fromToValue}
        type="text"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <CalendarTodayIcon
                sx={{
                  cursor: "pointer"
                }}
                onClick={(event) => {
                  setShowMenu(event.currentTarget);
                }}
              />
            </InputAdornment>
          )
        }}
      />
      <Menu
        anchorEl={showMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        open={Boolean(showMenu)}
        onClose={() => {
          setShowMenu(null);
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 2,
            width: "400px"
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "600", mb: 2 }}>
            {label}
          </Typography>

          <Grid
            container
            spacing={2}
            sx={{
              mb: 2
            }}
          >
            <Grid item xl={6} lg={6} md={12} sm={12} xs={12}>
              <CustomInput
                control={control}
                rules={fromDateRules}
                label={fromDateLabel}
                trigger={trigger}
                triggerTo="toDate"
                name="fromDate"
                type="date"
              />
            </Grid>
            {showTime && (
              <Grid item xl={6} lg={6} md={12} sm={12} xs={12}>
                <CustomInput control={control} rules={{}} label="Start" trigger={trigger} name="startTime" type="time" />
              </Grid>
            )}
            <Grid item xl={6} lg={6} md={12} sm={12} xs={12}>
              <CustomInput
                control={control}
                rules={{
                  ...toDateRules,
                  validate: (value) => {
                    if (watch().fromDate && value) {
                      const fromDateDate = new Date(watch().fromDate);
                      const toDateDate = new Date(value);

                      const fromDateOnlyDate = new Date(
                        fromDateDate.getFullYear(),
                        fromDateDate.getMonth(),
                        fromDateDate.getDate()
                      );
                      const toDateOnlyDate = new Date(toDateDate.getFullYear(), toDateDate.getMonth(), toDateDate.getDate());

                      if (fromDateOnlyDate > toDateOnlyDate) {
                        return "From phải < TO";
                      }
                      return true;
                    }
                    return true;
                  }
                }}
                label={toDateLabel}
                trigger={trigger}
                name="toDate"
                type="date"
              />
            </Grid>
            <Grid item xl={6} lg={6} md={12} sm={12} xs={12}>
              {showTime && (
                <CustomInput control={control} rules={{}} label="End" trigger={trigger} name="endTime" type="time" />
              )}
            </Grid>
          </Grid>

          {showTime && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2
              }}
            >
              <Typography variant="body1">Show time</Typography>

              <Switch
                size="small"
                checked={showTime}
                onChange={() => {
                  setShowTime(!showTime);
                }}
              />
            </Box>
          )}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: "600" }}>
              Time:
            </Typography>

            <Typography variant="body1" sx={{ fontWeight: "600" }}>
              {preview}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end"
            }}
          >
            <Button variant="contained" onClick={handleSubmit(handleFormDateSubmit)}>
              Submit
            </Button>
          </Box>
        </Box>
      </Menu>
    </>
  );
}

CustomDateFromToInput.defaultProps = {
  label: "",
  fromDateRules: {},
  toDateRules: {},
  fromDateLabel: "",
  toDateLabel: "",
  haveTime: undefined
};

CustomDateFromToInput.propTypes = {
  label: PropTypes.string,
  watchMainForm: PropTypes.func.isRequired,
  setMainFormValue: PropTypes.func.isRequired,
  fromDateName: PropTypes.string.isRequired,
  fromDateRules: PropTypes.object,
  toDateName: PropTypes.string.isRequired,
  toDateRules: PropTypes.object,
  fromDateLabel: PropTypes.string,
  toDateLabel: PropTypes.string,
  haveTime: PropTypes.bool
};

export default CustomDateFromToInput;
