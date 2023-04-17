import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { Checkbox, Grid, ListItemText, MenuItem, Select } from "@mui/material";
import { toast } from "react-toastify";
import CustomModal from "../../../components/CustomModal";

import { useFetchingStore } from "../../../store/FetchingApiStore";
import CustomInput from "../../../components/CustomInput/CustomInput";
import timeOffServices from "../../../services/timeOffServices";
import WithTimesLoaderWrapper from "../hocs/WithTimesLoaderWrapper";

function AddNewTimeOffModal({ show, setShow, data, setData, handleAfterAddTimeOff, timesList }) {
  const { handleSubmit, watch, control, trigger } = useForm({
    mode: "onChange",
    defaultValues: {
      timeStart: "",
      timeEnd: "",
      date: ""
    },
    criteriaMode: "all"
  });

  const { t } = useTranslation("scheduleFeature", { keyPrefix: "AddNewTimeOffModal" });
  const { t: tTimeOff } = useTranslation("timeOffEntity", { keyPrefix: "properties" });
  const { t: tInputValidation } = useTranslation("input", { keyPrefix: "validation" });

  const { fetchApi } = useFetchingStore();

  const [timeStartList, timeEndList] = useMemo(() => {
    const timesStart = [];
    const timesEnd = [];

    timesList.forEach((time) => {
      timesStart.push(time.timeStart);
      timesEnd.push(time.timeEnd);
    });

    return [timesStart, timesEnd];
  }, [timesList]);

  const handleAddTimeOff = async ({ date, timeStart, timeEnd }) => {
    // console.log({ data, date, timeStart, timeEnd });
    await fetchApi(async () => {
      const res = await timeOffServices.addNewTimeOff({ date, timeStart, timeEnd });
      if (res?.success) {
        setShow(false);
        setData({});
        if (handleAfterAddTimeOff) await handleAfterAddTimeOff();
        return { success: true };
      }
      toast(res.message);
      return { error: res.message };
    });
  };

  return (
    <CustomModal
      show={show}
      setShow={setShow}
      data={data}
      setData={setData}
      title={t("title")}
      submitBtnLabel={t("button.save")}
      onSubmit={handleSubmit(handleAddTimeOff)}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={4} lg={12} xl={6}>
          <CustomInput
            control={control}
            rules={{
              required: tInputValidation("required")
            }}
            label={tTimeOff("date")}
            trigger={trigger}
            name="date"
            type="date"
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={6} xl={3}>
          <CustomInput
            control={control}
            rules={{
              required: tInputValidation("required")
            }}
            label={tTimeOff("timeStart")}
            trigger={trigger}
            name="timeStart"
            triggerTo="timeEnd"
          >
            <Select
              renderValue={(selected) => {
                return selected;
              }}
            >
              {timeStartList.map((time) => {
                return (
                  <MenuItem key={time} value={time}>
                    <Checkbox checked={watch().timeStart === time} />
                    <ListItemText primary={time} />
                  </MenuItem>
                );
              })}
            </Select>
          </CustomInput>
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={6} xl={3}>
          <CustomInput
            control={control}
            rules={{
              required: tInputValidation("required"),
              validate: (value) => {
                const start = watch().timeStart;
                const end = value;

                if (start < end) {
                  return true;
                }
                return tInputValidation("rt", {
                  left: tTimeOff("timeStart")
                });
              }
            }}
            label={tTimeOff("timeEnd")}
            trigger={trigger}
            name="timeEnd"
          >
            <Select
              renderValue={(selected) => {
                return selected;
              }}
            >
              {timeEndList.map((time) => {
                return (
                  <MenuItem key={time} value={time}>
                    <Checkbox checked={watch().timeEnd === time} />
                    <ListItemText primary={time} />
                  </MenuItem>
                );
              })}
            </Select>
          </CustomInput>
        </Grid>
      </Grid>
    </CustomModal>
  );
}

AddNewTimeOffModal.defaultProps = {
  handleAfterAddTimeOff: undefined
};

AddNewTimeOffModal.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  setData: PropTypes.func.isRequired,
  handleAfterAddTimeOff: PropTypes.func,
  timesList: PropTypes.array.isRequired
};

export default WithTimesLoaderWrapper(AddNewTimeOffModal);
