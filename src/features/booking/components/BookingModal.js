// import {
//   Box,
//   Checkbox,
//   CircularProgress,
//   FormControl,
//   FormControlLabel,
//   FormLabel,
//   Grid,
//   ListItemText,
//   MenuItem,
//   Radio,
//   RadioGroup,
//   Select,
//   Typography
// } from "@mui/material";
// import formatDate from "date-and-time";
// import { useEffect, useMemo, useState } from "react";
// import PropTypes from "prop-types";
// import { useTranslation } from "react-i18next";
// import { toast } from "react-toastify";
// import { useForm } from "react-hook-form";
// import CustomInput from "../../../components/CustomInput/CustomInput";
// import CustomModal from "../../../components/CustomModal";
// import { useFetchingStore } from "../../../store/FetchingApiStore/hooks";
// import bookingServices from "../../../services/bookingServices";
// import { useAppConfigStore } from "../../../store/AppConfigStore/hooks";
// import { patientGenders, patientInputValidate } from "../../../entities/Patient/constant";
// import { scheduleTypes } from "../../../entities/Schedule";
// import { bookingInputValidate } from "../../../entities/Booking";
// import WithPatientsLoaderWrapper from "../../patient/hocs/WithPatientsLoaderWrapper";
// import useDebounce from "../../../hooks/useDebounce";
// import { cleanUndefinedAndNullValueObjectToStrObj } from "../../../utils/objectUtil";
// // import patientServices from "../../../services/patientServices";

// function BookingModal({ show, setShow, data, setData, handleAfterBooking, patients }) {
//   const bookingForm = useForm({
//     defaultValues: {
//       scheduleId: data?.schedule?.id,
//       timeId: data?.time?.id,
//       date: data?.date,
//       reason: ""
//     }
//   });

//   const addPatientForm = useForm({
//     defaultValues: {
//       phoneNumber: "",
//       name: "",
//       gender: "",
//       address: "",
//       dob: "",
//       healthInsurance: ""
//     }
//   });

//   const { fetchApi } = useFetchingStore();
//   const { locale } = useAppConfigStore();

//   const book = async ({ scheduleId, timeId, date, reason }, patientId = "") => {
//     // await fetchApi(async () => {
//     //   // console.log("data: ", data);
//     //   const res = await bookingServices.book({
//     //     scheduleId,
//     //     timeId,
//     //     date: formatDate.format(date, "YYYY-MM-DD"),
//     //     reason,
//     //     patientId
//     //   });
//     //   if (res?.success) {
//     //     const booking = res?.booking;
//     //     setShow(false);
//     //     setData({});
//     //     if (handleAfterBooking) await handleAfterBooking(booking);
//     //     return { success: true };
//     //   }
//     //   toast(res.message);
//     //   return { error: res.message };
//     // });
//   };

//   const addPatient = async ({ phoneNumber, name, gender, address, dob, healthInsurance }) => {
//     // let newPatient;
//     // await fetchApi(async () => {
//     //   const res = await patientServices.createPatient({ phoneNumber, name, gender, address, dob, healthInsurance });
//     //   if (res?.success) {
//     //     newPatient = res?.patient;
//     //     return { success: true };
//     //   }
//     //   toast(res.message);
//     //   return { error: res.message };
//     // });
//     // return newPatient;
//   };

//   const handleBooking = async ({ scheduleId, timeId, date, reason }) => {
//     // await book({ scheduleId, timeId, date, reason });
//   };

//   const handleAddPatient = async ({ phoneNumber, name, gender, address, dob, healthInsurance }) => {
//     // // console.log("handleAddPatient: ", { phoneNumber, name, gender, address, dob, healthInsurance });
//     // const patientFormData = { phoneNumber, name, gender, address, dob, healthInsurance };
//     // const isPatientDataChanged = Object.keys(patientFormData).some((key) => {
//     //   return patientFormData[key] !== patient?.[key];
//     // });
//     // // console.log("isPatientDataChanged: ", isPatientDataChanged);
//     // // Nếu thay đổi thì tạo patient mới
//     // if (isPatientDataChanged) {
//     //   const newPatient = await addPatient({ phoneNumber, name, gender, address, dob, healthInsurance });
//     //   if (newPatient?.id) {
//     //     // console.log("newPatient?.id: ", newPatient?.id);
//     //     await book({ ...bookingForm.watch() }, newPatient?.id);
//     //   }
//     // }
//     // // Nếu ko thay đổi thì tạo lấy patientId đó
//     // else {
//     //   await book({ ...bookingForm.watch() }, patient?.id);
//     // }
//   };

//   const handleBeforeBookingSubmit = () => {
//     // if (isSelf) {
//     //   // console.log("Booking Self");
//     //   return bookingForm.handleSubmit(handleBooking);
//     // }
//     // return bookingForm.handleSubmit(addPatientForm.handleSubmit(handleAddPatient));
//   };

//   const { t } = useTranslation("bookingFeature", { keyPrefix: "BookingModal" });
//   const { t: tBooking } = useTranslation("bookingEntity", { keyPrefix: "properties" });
//   const { t: tScheduleConstants } = useTranslation("scheduleEntity", { keyPrefix: "constants" });
//   const { t: tPatient } = useTranslation("patientEntity", { keyPrefix: "properties" });
//   const { t: tPatientConstants } = useTranslation("patientEntity", { keyPrefix: "constants" });
//   const { t: tInputValidate } = useTranslation("input", { keyPrefix: "validation" });

//   const scheduleTypeListObj = useMemo(() => {
//     return [
//       {
//         label: tScheduleConstants("types.offline"),
//         value: scheduleTypes.TYPE_OFFLINE
//       },
//       {
//         label: tScheduleConstants("types.online"),
//         value: scheduleTypes.TYPE_ONLINE
//       }
//     ].reduce((obj, cur) => {
//       return {
//         ...obj,
//         [cur?.value]: cur
//       };
//     }, {});
//   }, [locale]);

//   const genderListObj = useMemo(() => {
//     return [
//       {
//         label: tPatientConstants("genders.male"),
//         value: patientGenders.MALE
//       },
//       {
//         label: tPatientConstants("genders.female"),
//         value: patientGenders.FEMALE
//       },
//       {
//         label: tPatientConstants("genders.other"),
//         value: patientGenders.OTHER
//       },
//       {
//         label: tPatientConstants("genders.none"),
//         value: ""
//       }
//     ].reduce((obj, cur) => {
//       return {
//         ...obj,
//         [cur?.value]: cur
//       };
//     }, {});
//   }, [locale]);

//   return (
//     <CustomModal
//       show={show}
//       setShow={setShow}
//       data={data}
//       setData={setData}
//       title={t("title")}
//       submitBtnLabel={t("button.book")}
//       onSubmit={handleBeforeBookingSubmit()}
//     >
//       <Box
//         sx={{
//           width: "100%",
//           maxHeight: 500,
//           overflow: "scroll",
//           px: 2
//         }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: {
//               sm: "row",
//               xs: "column"
//             },
//             justifyContent: "flex-start",
//             alignItems: {
//               sm: "center",
//               xs: "flex-start"
//             },
//             mb: 2
//           }}
//         >
//           <Typography fontWeight={600} mr={2}>
//             {tBooking("date")}:
//           </Typography>
//           <Typography fontWeight={500} textAlign="center">
//             {formatDate.format(new Date(data?.date), "ddd, DD/MM/YYYY")}{" "}
//             {`(${scheduleTypeListObj?.[data?.schedule?.type]?.label})`}
//           </Typography>
//         </Box>
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: {
//               sm: "row",
//               xs: "column"
//             },
//             justifyContent: "flex-start",
//             alignItems: {
//               sm: "center",
//               xs: "flex-start"
//             },
//             mb: 2
//           }}
//         >
//           <Typography fontWeight={600} mr={2}>
//             {tBooking("time")}:
//           </Typography>
//           <Typography fontWeight={500} textAlign="center">
//             {`${data?.time?.timeStart?.split(":")[0]}:${data?.time?.timeStart?.split(":")[1]}`} -{" "}
//             {`${data?.time?.timeEnd?.split(":")[0]}:${data?.time?.timeEnd?.split(":")[1]}`}
//           </Typography>
//         </Box>

//         <FormControl
//           sx={{
//             mb: 2
//           }}
//         >
//           <FormLabel>{t("form.bookingFor")}:</FormLabel>
//           <RadioGroup row defaultValue="self">
//             <FormControlLabel value="self" control={<Radio onClick={() => setIsSelf(true)} />} label={t("form.self")} />
//             <FormControlLabel value="other" control={<Radio onClick={() => setIsSelf(false)} />} label={t("form.other")} />
//           </RadioGroup>
//         </FormControl>

//         <Box
//           sx={{
//             mb: 2
//           }}
//         >
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "flex-start",
//               alignItems: "center",
//               mb: 2
//             }}
//           >
//             <Typography fontWeight={600}>{t("subTitle.bookingForOther")}:</Typography>
//             {isNameWaiting && (
//               <CircularProgress
//                 sx={{
//                   ml: 2
//                 }}
//                 color="primary"
//                 size={24}
//                 thickness={3}
//               />
//             )}
//           </Box>

//           <Grid container spacing={2}>
//             <Grid item lg={6} xs={12}>
//               <CustomInput
//                 control={addPatientForm.control}
//                 rules={{
//                   required: tInputValidate("required"),
//                   maxLength: {
//                     value: patientInputValidate.NAME_MAX_LENGTH,
//                     message: tInputValidate("maxLength", {
//                       maxLength: patientInputValidate.NAME_MAX_LENGTH
//                     })
//                   }
//                 }}
//                 label={tPatient("name")}
//                 trigger={addPatientForm.trigger}
//                 name="name"
//                 type="text"
//               />
//             </Grid>
//             <Grid item lg={6} xs={12}>
//               <CustomInput
//                 control={addPatientForm.control}
//                 rules={{
//                   required: tInputValidate("required"),
//                   pattern: {
//                     value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
//                     message: tInputValidate("format")
//                   }
//                 }}
//                 label={tPatient("phoneNumber")}
//                 trigger={addPatientForm.trigger}
//                 name="phoneNumber"
//                 type="tel"
//               />
//             </Grid>
//             <Grid item lg={6} xs={12}>
//               <CustomInput
//                 control={addPatientForm.control}
//                 rules={{ required: tInputValidate("required") }}
//                 label={tPatient("gender")}
//                 trigger={addPatientForm.trigger}
//                 name="gender"
//               >
//                 <Select
//                   renderValue={(selected) => {
//                     return genderListObj[selected].label;
//                   }}
//                 >
//                   {Object.keys(genderListObj).map((key) => {
//                     const item = genderListObj[key];

//                     return (
//                       <MenuItem key={item?.value} value={item?.value}>
//                         <Checkbox checked={addPatientForm.watch().gender === item?.value} />
//                         <ListItemText primary={item?.label} />
//                       </MenuItem>
//                     );
//                   })}
//                 </Select>
//               </CustomInput>
//             </Grid>
//             <Grid item lg={6} xs={12}>
//               <CustomInput
//                 control={addPatientForm.control}
//                 rules={{ required: tInputValidate("required") }}
//                 label={tPatient("dob")}
//                 trigger={addPatientForm.trigger}
//                 name="dob"
//                 type="date"
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <CustomInput
//                 control={addPatientForm.control}
//                 rules={{
//                   maxLength: {
//                     value: patientInputValidate.HEALTH_INSURANCE_MAX_LENGTH,
//                     message: tInputValidate("maxLength", {
//                       maxLength: patientInputValidate.HEALTH_INSURANCE_MAX_LENGTH
//                     })
//                   }
//                 }}
//                 label={tPatient("healthInsurance")}
//                 trigger={addPatientForm.trigger}
//                 name="healthInsurance"
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <CustomInput
//                 control={addPatientForm.control}
//                 rules={{
//                   required: tInputValidate("required"),
//                   maxLength: {
//                     value: patientInputValidate.ADDRESS_MAX_LENGTH,
//                     message: tInputValidate("maxLength", {
//                       maxLength: patientInputValidate.ADDRESS_MAX_LENGTH
//                     })
//                   }
//                 }}
//                 label={tPatient("address")}
//                 trigger={addPatientForm.trigger}
//                 name="address"
//                 multiline
//                 rows={5}
//               />
//             </Grid>
//           </Grid>
//         </Box>

//         <CustomInput
//           control={bookingForm.control}
//           label={tBooking("reason")}
//           rules={{
//             required: tInputValidate("required"),
//             maxLength: {
//               value: bookingInputValidate.REASON_MAX_LENGTH,
//               message: tInputValidate("maxLength", {
//                 maxLength: bookingInputValidate.REASON_MAX_LENGTH
//               })
//             }
//           }}
//           name="reason"
//           trigger={bookingForm.trigger}
//           multiline
//           fullWidth
//           rows={4}
//         />
//       </Box>
//     </CustomModal>
//   );
// }

// BookingModal.propTypes = {
//   show: PropTypes.bool.isRequired,
//   setShow: PropTypes.func.isRequired,
//   data: PropTypes.object.isRequired,
//   setData: PropTypes.func.isRequired,
//   handleAfterBooking: PropTypes.func.isRequired,
//   patients: PropTypes.array.isRequired
// };

// export default WithPatientsLoaderWrapper(BookingModal);
