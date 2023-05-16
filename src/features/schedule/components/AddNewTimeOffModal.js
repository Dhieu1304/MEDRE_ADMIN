import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Checkbox, Grid, ListItemText, MenuItem, Select } from "@mui/material";
import { toast } from "react-toastify";
import CustomModal from "../../../components/CustomModal";

import { useFetchingStore } from "../../../store/FetchingApiStore";
import CustomInput from "../../../components/CustomInput/CustomInput";
import timeOffServices from "../../../services/timeOffServices";
import WithTimesLoaderWrapper from "../hocs/WithTimesLoaderWrapper";
import { useTimeOffSessionsContantTranslation } from "../hooks/useTimeOffConstantsTranslation";

function AddNewTimeOffModal({ show, setShow, data, setData, handleAfterAddTimeOff }) {
  const { handleSubmit, watch, control, trigger } = useForm({
    mode: "onChange",
    defaultValues: {
      from: "",
      to: "",
      session: ""
    },
    criteriaMode: "all"
  });

  const { t } = useTranslation("scheduleFeature", { keyPrefix: "AddNewTimeOffModal" });
  const { t: tTimeOff } = useTranslation("timeOffEntity", { keyPrefix: "properties" });
  const { t: tInputValidate } = useTranslation("input", { keyPrefix: "validation" });
  const [timeOffSessionContantList, timeOffSessionContantListObj] = useTimeOffSessionsContantTranslation();

  const { fetchApi } = useFetchingStore();

  const handleAddTimeOff = async ({ from, to, session }) => {
    // console.log({ data, date, session });
    await fetchApi(async () => {
      const res = await timeOffServices.addNewTimeOff({ from, to, session });
      if (res?.success) {
        setShow(false);
        setData({});
        toast(res.message);
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
        <Grid item xs={12} md={4}>
          <CustomInput
            control={control}
            rules={{
              required: tInputValidate("required")
            }}
            label={tTimeOff("from")}
            trigger={trigger}
            name="from"
            type="date"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <CustomInput
            control={control}
            rules={{
              required: `${tTimeOff("to")} ${tInputValidate("required")}`,
              validate: (value) => {
                const { from } = watch();
                const to = value;

                if (from <= to) {
                  return true;
                }
                return tInputValidate("gte", {
                  left: tTimeOff("toLabel"),
                  right: tTimeOff("fromLabel")
                });
              }
            }}
            label={tTimeOff("to")}
            trigger={trigger}
            name="to"
            type="date"
            isCustomError
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <CustomInput
            control={control}
            rules={{
              required: tInputValidate("required")
            }}
            label={tTimeOff("session")}
            trigger={trigger}
            name="session"
          >
            <Select
              renderValue={(selected) => {
                return timeOffSessionContantListObj[selected].label;
              }}
            >
              {timeOffSessionContantList?.map((timeOffSession) => {
                return (
                  <MenuItem key={timeOffSession?.value} value={timeOffSession?.value}>
                    <Checkbox checked={watch().session === timeOffSession?.value} />
                    <ListItemText primary={timeOffSession?.label} />
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
  handleAfterAddTimeOff: PropTypes.func
};

export default WithTimesLoaderWrapper(AddNewTimeOffModal);
