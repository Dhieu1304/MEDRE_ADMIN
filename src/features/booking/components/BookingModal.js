import { Box, Checkbox, Grid, ListItemText, MenuItem, Select, Typography } from "@mui/material";
import formatDate from "date-and-time";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import CustomInput from "../../../components/CustomInput/CustomInput";
import CustomModal from "../../../components/CustomModal";
import { useFetchingStore } from "../../../store/FetchingApiStore/hooks";
import bookingServices from "../../../services/bookingServices";
import { patientInputValidate } from "../../../entities/Patient/constant";
import { bookingInputValidate } from "../../../entities/Booking";
import { usePatientGendersContantTranslation } from "../../patient/hooks/usePatientConstantsTranslation";
import { useScheduleTypesContantTranslation } from "../../schedule/hooks/useScheduleConstantsTranslation";
import patientServices from "../../../services/patientServices";
// import patientServices from "../../../services/patientServices";

function BookingModal({ show, setShow, data, setData, handleAfterBooking }) {
  const bookingForm = useForm({
    defaultValues: {
      scheduleId: data?.schedule?.id,
      timeId: data?.time?.id,
      date: data?.date,
      reason: ""
    }
  });

  const addPatientForm = useForm({
    defaultValues: {
      phoneNumber: "0375435892",
      name: "Nguyen Hiệu",
      gender: "Male",
      address: "sádfd",
      dob: "2001-01-01",
      healthInsurance: ""
    }
  });

  const { fetchApi } = useFetchingStore();

  const book = async ({ scheduleId, timeId, date, reason }, patientId = "") => {
    await fetchApi(async () => {
      // console.log("data: ", data);
      const res = await bookingServices.book({
        scheduleId,
        timeId,
        date: formatDate.format(date, "YYYY-MM-DD"),
        reason,
        patientId
      });

      if (res?.success) {
        const booking = res?.booking;
        setShow(false);
        setData({});
        if (handleAfterBooking) await handleAfterBooking(booking);
        return { ...res };
      }
      return { ...res };
    });
  };

  const addPatient = async ({ phoneNumber, name, gender, address, dob, healthInsurance }) => {
    let newPatient;
    await fetchApi(async () => {
      const res = await patientServices.createPatient({ phoneNumber, name, gender, address, dob, healthInsurance });
      if (res?.success) {
        newPatient = res?.patient;
        return { ...res };
      }
      return { ...res };
    });
    return newPatient;
  };

  const handleAddPatient = async ({ phoneNumber, name, gender, address, dob, healthInsurance }) => {
    // console.log("handleAddPatient: ", { phoneNumber, name, gender, address, dob, healthInsurance });
    const patientFormData = { phoneNumber, name, gender, address, dob, healthInsurance };
    const newPatient = await addPatient(patientFormData);
    // console.log("newPatient: ", newPatient);
    if (newPatient?.id) {
      // console.log("newPatient?.id: ", newPatient?.id);
      await book({ ...bookingForm.watch() }, newPatient?.id);
    }
  };

  const handleBeforeBookingSubmit = () => {
    return bookingForm.handleSubmit(addPatientForm.handleSubmit(handleAddPatient));
  };

  const { t } = useTranslation("bookingFeature", { keyPrefix: "BookingModal" });
  const { t: tBooking } = useTranslation("bookingEntity", { keyPrefix: "properties" });
  const { t: tPatient } = useTranslation("patientEntity", { keyPrefix: "properties" });
  const { t: tInputValidate } = useTranslation("input", { keyPrefix: "validation" });

  const [, scheduleTypeContantListObj] = useScheduleTypesContantTranslation();

  const [patientGenderContantList, patientGenderContantListObj] = usePatientGendersContantTranslation();

  return (
    <CustomModal
      show={show}
      setShow={setShow}
      data={data}
      setData={setData}
      title={t("title")}
      submitBtnLabel={t("button.book")}
      onSubmit={handleBeforeBookingSubmit()}
    >
      <Box
        sx={{
          width: "100%",
          maxHeight: 500,
          overflow: "scroll",
          px: 2
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              sm: "row",
              xs: "column"
            },
            justifyContent: "flex-start",
            alignItems: {
              sm: "center",
              xs: "flex-start"
            },
            mb: 2
          }}
        >
          <Typography fontWeight={600} mr={2}>
            {tBooking("date")}:
          </Typography>
          <Typography fontWeight={500} textAlign="center">
            {formatDate.format(new Date(data?.date), "ddd, DD/MM/YYYY")}{" "}
            {`(${scheduleTypeContantListObj?.[data?.schedule?.type]?.label})`}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              sm: "row",
              xs: "column"
            },
            justifyContent: "flex-start",
            alignItems: {
              sm: "center",
              xs: "flex-start"
            },
            mb: 2
          }}
        >
          <Typography fontWeight={600} mr={2}>
            {tBooking("time")}:
          </Typography>
          <Typography fontWeight={500} textAlign="center">
            {`${data?.time?.timeStart?.split(":")[0]}:${data?.time?.timeStart?.split(":")[1]}`} -{" "}
            {`${data?.time?.timeEnd?.split(":")[0]}:${data?.time?.timeEnd?.split(":")[1]}`}
          </Typography>
        </Box>

        <Box
          sx={{
            mb: 2
          }}
        >
          <Box
            sx={{
              mb: 2,
              display: "flex",
              alignItems: "center"
            }}
          >
            <Typography
              fontWeight={600}
              sx={{
                mr: 2
              }}
            >
              {t("subTitle.patientInfo")}
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item lg={6} xs={12}>
              <CustomInput
                control={addPatientForm.control}
                rules={{
                  required: tInputValidate("required"),
                  pattern: {
                    value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
                    message: tInputValidate("format")
                  }
                }}
                label={tPatient("phoneNumber")}
                trigger={addPatientForm.trigger}
                name="phoneNumber"
                type="tel"
              />
            </Grid>
            <Grid item lg={6} xs={12}>
              <CustomInput
                control={addPatientForm.control}
                rules={{
                  required: tInputValidate("required"),
                  maxLength: {
                    value: patientInputValidate.NAME_MAX_LENGTH,
                    message: tInputValidate("maxLength", {
                      maxLength: patientInputValidate.NAME_MAX_LENGTH
                    })
                  }
                }}
                label={tPatient("name")}
                trigger={addPatientForm.trigger}
                name="name"
                type="text"
              />
            </Grid>
            <Grid item lg={6} xs={12}>
              <CustomInput
                control={addPatientForm.control}
                rules={{ required: tInputValidate("required") }}
                label={tPatient("gender")}
                trigger={addPatientForm.trigger}
                name="gender"
              >
                <Select
                  renderValue={(selected) => {
                    return patientGenderContantListObj[selected].label;
                  }}
                >
                  {patientGenderContantList.map((gender) => {
                    return (
                      <MenuItem key={gender?.value} value={gender?.value}>
                        <Checkbox checked={addPatientForm.watch().gender === gender?.value} />
                        <ListItemText primary={gender?.label} />
                      </MenuItem>
                    );
                  })}
                </Select>
              </CustomInput>
            </Grid>
            <Grid item lg={6} xs={12}>
              <CustomInput
                control={addPatientForm.control}
                rules={{ required: tInputValidate("required") }}
                label={tPatient("dob")}
                trigger={addPatientForm.trigger}
                name="dob"
                type="date"
              />
            </Grid>

            <Grid item xs={12}>
              <CustomInput
                control={addPatientForm.control}
                rules={{
                  maxLength: {
                    value: patientInputValidate.HEALTH_INSURANCE_MAX_LENGTH,
                    message: tInputValidate("maxLength", {
                      maxLength: patientInputValidate.HEALTH_INSURANCE_MAX_LENGTH
                    })
                  }
                }}
                label={tPatient("healthInsurance")}
                trigger={addPatientForm.trigger}
                name="healthInsurance"
              />
            </Grid>

            <Grid item xs={12}>
              <CustomInput
                control={addPatientForm.control}
                rules={{
                  required: tInputValidate("required"),
                  maxLength: {
                    value: patientInputValidate.ADDRESS_MAX_LENGTH,
                    message: tInputValidate("maxLength", {
                      maxLength: patientInputValidate.ADDRESS_MAX_LENGTH
                    })
                  }
                }}
                label={tPatient("address")}
                trigger={addPatientForm.trigger}
                name="address"
                multiline
                rows={5}
              />
            </Grid>
          </Grid>
        </Box>

        <CustomInput
          control={bookingForm.control}
          label={tBooking("reason")}
          rules={{
            required: tInputValidate("required"),
            maxLength: {
              value: bookingInputValidate.REASON_MAX_LENGTH,
              message: tInputValidate("maxLength", {
                maxLength: bookingInputValidate.REASON_MAX_LENGTH
              })
            }
          }}
          name="reason"
          trigger={bookingForm.trigger}
          multiline
          fullWidth
          rows={4}
        />
      </Box>
    </CustomModal>
  );
}

BookingModal.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  setData: PropTypes.func.isRequired,
  handleAfterBooking: PropTypes.func.isRequired
};

export default BookingModal;
