import { Box, Checkbox, Grid, InputAdornment, ListItemText, MenuItem, Select, Tab, Tabs, Typography } from "@mui/material";
import formatDate from "date-and-time";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import CustomInput from "../../../components/CustomInput/CustomInput";
import CustomModal from "../../../components/CustomModal";
import { useFetchingStore } from "../../../store/FetchingApiStore/hooks";
import bookingServices from "../../../services/bookingServices";
import { patientInputValidate } from "../../../entities/Patient/constant";
import { bookingInputValidate } from "../../../entities/Booking";
import { usePatientGendersContantTranslation } from "../../patient/hooks/usePatientConstantsTranslation";
import { useScheduleTypesContantTranslation } from "../../schedule/hooks/useScheduleConstantsTranslation";
import patientServices from "../../../services/patientServices";
import ClipboardButton from "../../../components/ClipboardButton";
import userServices from "../../../services/userServices";
import { cleanUndefinedAndNullValueObjectToStrObj } from "../../../utils/objectUtil";
import { scheduleTypes } from "../../../entities/Schedule";
// import patientServices from "../../../services/patientServices";

const tabTypes = {
  USER: "USER",
  PATIENT: "PATIENT",
  NEW_PATIENT: "NEW_PATIENT"
};

function BookingModal({ show, setShow, data, setData, handleAfterBooking }) {
  const [user, setUser] = useState();
  const [patient, setPatient] = useState();

  const bookingForm = useForm({
    defaultValues: {
      scheduleId: data?.schedule?.id,
      timeId: data?.time?.id,
      date: data?.date,
      reason: "",
      userId: "",
      patientId: ""
    }
  });

  const [tabValue, setTabValue] = useState(tabTypes.USER);

  const createAddPatientFormDefaultValues = ({ phoneNumber, name, gender, address, dob, healthInsurance } = {}) => {
    return cleanUndefinedAndNullValueObjectToStrObj({ phoneNumber, name, gender, address, dob, healthInsurance });
  };

  const addPatientForm = useForm({
    defaultValues: createAddPatientFormDefaultValues()
  });

  const { fetchApi } = useFetchingStore();

  const book = async ({ scheduleId, timeId, date, reason, patientId, userId }, isBookingByPatientId = false) => {
    let bookData = { scheduleId, timeId, date, reason };
    if (isBookingByPatientId) {
      bookData = { ...bookData, patientId };
    } else {
      bookData = { ...bookData, userId };
    }

    // console.log("bookData: ", bookData);

    await fetchApi(async () => {
      // console.log("data: ", data);
      const res = await bookingServices.book({
        ...bookData,
        date: formatDate.format(date, "YYYY-MM-DD")
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
    const patientFormData = { phoneNumber, name, gender, address, dob, healthInsurance };
    const newPatient = await addPatient(patientFormData);
    // console.log("newPatient: ", newPatient);
    if (newPatient?.id) {
      await book({ ...bookingForm.watch() }, true);
    }
  };

  const handleBooking = async ({ scheduleId, timeId, date, reason, patientId, userId }) => {
    if (tabValue === tabTypes.USER) await book({ scheduleId, timeId, date, reason, patientId, userId });
    else if (tabValue === tabTypes.PATIENT) await book({ scheduleId, timeId, date, reason, patientId, userId }, true);
  };

  const handleBeforeBookingSubmit = () => {
    switch (tabValue) {
      case tabTypes.USER:
      case tabTypes.PATIENT:
        return bookingForm.handleSubmit(handleBooking);

      case tabTypes.NEW_PATIENT:
      default:
        return bookingForm.handleSubmit(addPatientForm.handleSubmit(handleAddPatient));
    }
  };

  const { t } = useTranslation("bookingFeature", { keyPrefix: "BookingModal" });
  const { t: tBooking } = useTranslation("bookingEntity", { keyPrefix: "properties" });
  const { t: tPatient } = useTranslation("patientEntity", { keyPrefix: "properties" });
  const { t: tInputValidate } = useTranslation("input", { keyPrefix: "validation" });

  const [, scheduleTypeContantListObj] = useScheduleTypesContantTranslation();

  const [patientGenderContantList, patientGenderContantListObj] = usePatientGendersContantTranslation();

  useEffect(() => {
    const loadUser = async (userId) => {
      await fetchApi(async () => {
        // console.log("userId: ", userId);
        const res = await userServices.getUserDetail(userId);
        if (res?.success) {
          const newUser = res?.user;
          setUser({ ...newUser });
          addPatientForm.reset(createAddPatientFormDefaultValues(newUser));
          return { ...res };
        }
        return { ...res };
      });
    };
    const { userId } = bookingForm.watch();
    if (userId) {
      loadUser(userId);
    }
  }, [bookingForm.watch().userId]);

  useEffect(() => {
    const loadPatient = async (patientId) => {
      // console.log("patientId: ", patientId);
      await fetchApi(async () => {
        const res = await patientServices.getPatientDetail(patientId);
        if (res?.success) {
          const newPatient = res?.patient;
          setPatient({ ...newPatient });
          addPatientForm.reset(createAddPatientFormDefaultValues(newPatient));
          return { ...res };
        }
        return { ...res };
      });
    };
    const { patientId } = bookingForm.watch();
    if (patientId) {
      loadPatient(patientId);
    }
  }, [bookingForm.watch().patientId]);

  // console.log("bookingForm.watch(): ", bookingForm.watch());

  useEffect(() => {
    const { USER, PATIENT } = tabTypes;
    switch (tabValue) {
      case USER:
        addPatientForm.reset(createAddPatientFormDefaultValues(user));
        break;
      case PATIENT:
        addPatientForm.reset(createAddPatientFormDefaultValues(patient));
        break;

      default:
        break;
    }
  }, [tabValue]);

  const renderTab = (value) => {
    const { USER, PATIENT, NEW_PATIENT } = tabTypes;

    switch (value) {
      case USER:
        return (
          <CustomInput
            key={USER}
            control={bookingForm.control}
            label={tBooking("userId")}
            trigger={bookingForm.trigger}
            name="userId"
            rules={{
              required: tInputValidate("required")
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <ClipboardButton
                    setValue={(textValue) => {
                      bookingForm.setValue("userId", textValue);
                    }}
                  />
                </InputAdornment>
              )
            }}
          />
        );

      case PATIENT:
        return (
          <CustomInput
            key={PATIENT}
            control={bookingForm.control}
            label={tBooking("patientId")}
            trigger={bookingForm.trigger}
            name="patientId"
            rules={{
              required: tInputValidate("required")
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <ClipboardButton
                    setValue={(textValue) => {
                      bookingForm.setValue("patientId", textValue);
                    }}
                  />
                </InputAdornment>
              )
            }}
          />
        );

      case NEW_PATIENT:
      default:
        return null;
    }
  };

  const renderNewPatientInputRules = (rules) => {
    switch (tabValue) {
      case tabTypes.USER:
      case tabTypes.PATIENT:
        return {};

      case tabTypes.NEW_PATIENT:
      default:
        return rules;
    }
  };

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
            {tBooking("price")}:
          </Typography>
          <Typography fontWeight={500} textAlign="center">
            {data?.schedule?.type === scheduleTypes.TYPE_OFFLINE
              ? data?.schedule?.scheduleExpertise?.priceOffline
              : data?.schedule?.scheduleExpertise?.priceOnline}
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

          <Tabs
            value={tabValue}
            onChange={(e, newValue) => {
              // console.log("newValue: ", newValue);
              setTabValue(newValue);
            }}
            sx={{
              mb: 2,
              mt: 0
            }}
          >
            <Tab value={tabTypes.USER} label={t("tabLabels.user")} />

            <Tab value={tabTypes.PATIENT} label={t("tabLabels.patient")} />

            <Tab value={tabTypes.NEW_PATIENT} label={t("tabLabels.newPatient")} />
          </Tabs>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              {renderTab(tabValue)}
            </Grid>
            <Grid item lg={6} xs={12}>
              <CustomInput
                control={addPatientForm.control}
                rules={renderNewPatientInputRules({
                  required: tInputValidate("required")
                  // pattern: {
                  //   value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
                  //   message: tInputValidate("format")
                  // }
                })}
                label={tPatient("phoneNumber")}
                trigger={addPatientForm.trigger}
                name="phoneNumber"
              />
            </Grid>
            <Grid item lg={6} xs={12}>
              <CustomInput
                control={addPatientForm.control}
                rules={renderNewPatientInputRules({
                  required: tInputValidate("required"),
                  maxLength: {
                    value: patientInputValidate.NAME_MAX_LENGTH,
                    message: tInputValidate("maxLength", {
                      maxLength: patientInputValidate.NAME_MAX_LENGTH
                    })
                  }
                })}
                label={tPatient("name")}
                trigger={addPatientForm.trigger}
                name="name"
                type="text"
              />
            </Grid>
            <Grid item lg={6} xs={12}>
              <CustomInput
                control={addPatientForm.control}
                rules={renderNewPatientInputRules({
                  required: tInputValidate("required")
                })}
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
                rules={renderNewPatientInputRules({
                  required: tInputValidate("required")
                })}
                label={tPatient("dob")}
                trigger={addPatientForm.trigger}
                name="dob"
                type="date"
              />
            </Grid>

            <Grid item xs={12}>
              <CustomInput
                control={addPatientForm.control}
                rules={renderNewPatientInputRules({
                  maxLength: {
                    value: patientInputValidate.HEALTH_INSURANCE_MAX_LENGTH,
                    message: tInputValidate("maxLength", {
                      maxLength: patientInputValidate.HEALTH_INSURANCE_MAX_LENGTH
                    })
                  }
                })}
                label={tPatient("healthInsurance")}
                trigger={addPatientForm.trigger}
                name="healthInsurance"
              />
            </Grid>

            <Grid item xs={12}>
              <CustomInput
                control={addPatientForm.control}
                rules={renderNewPatientInputRules({
                  required: tInputValidate("required"),
                  maxLength: {
                    value: patientInputValidate.ADDRESS_MAX_LENGTH,
                    message: tInputValidate("maxLength", {
                      maxLength: patientInputValidate.ADDRESS_MAX_LENGTH
                    })
                  }
                })}
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
