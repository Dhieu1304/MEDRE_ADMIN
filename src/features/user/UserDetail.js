// import React, { useEffect, useMemo, useState } from "react";
// import PropTypes from "prop-types";

// import {
//   Grid,
//   Button,
//   Box,
//   Typography,
//   Avatar,
//   Card,
//   CardHeader,
//   Select,
//   MenuItem,
//   Checkbox,
//   ListItemText,
//   IconButton,
//   InputAdornment,
//   useTheme
// } from "@mui/material";
// import { useForm } from "react-hook-form";
// import { useTranslation } from "react-i18next";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   Add as AddIcon,
//   CalendarMonth as CalendarMonthIcon,
//   RestartAlt as RestartAltIcon,
//   Save as SaveIcon
// } from "@mui/icons-material";
// import { toast } from "react-toastify";
// import { useAbility } from "@casl/react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faGear as faGearIcon } from "@fortawesome/free-solid-svg-icons";
// import CustomInput from "../../components/CustomInput";

// import userServices from "../../services/userServices";
// import { useFetchingStore } from "../../store/FetchingApiStore/hooks";
// import CustomOverlay from "../../components/CustomOverlay";
// import ChangeAvatarModal from "./components/ChangeAvatarModal";
// import { useCustomModal } from "../../components/CustomModal";
// import AddExpertiseModal from "./components/AddExpertiseModal";
// import { userDetailRoutes } from "../../pages/UserPage/routes";
// import routeConfig from "../../config/routeConfig";
// import User, { userActionAbility, userGenders, userInputValidate, userStatus } from "../../entities/User";
// import { AbilityContext } from "../../store/AbilityStore";
// import { NotHaveAccessModal } from "../auth";
// import { Expertise, expertiseActionAbility } from "../../entities/Expertise";
// import EditUserRoleModal from "./components/EditUserRoleModal";
// import { mergeObjectsWithoutNullAndUndefined } from "../../utils/objectUtil";
// import { useAuthStore } from "../../store/AuthStore";
// import { BlockUserModal } from "./components";
// import WithExpertisesLoaderWrapper from "./components/WithExpertisesLoaderWrapper";
// import UnblockUserModal from "./components/UnblockUserModal";

// function UserDetail({ expertisesList, loadExpertisesList }) {
//   const [user, setUser] = useState(new User());

//   const { t } = useTranslation("userFeature", { keyPrefix: "UserDetail" });
//   const { t: tBtn } = useTranslation("userFeature", { keyPrefix: "UserDetail.button" });

//   const { t: tUser } = useTranslation("userEntity", { keyPrefix: "properties" });
//   const { t: tUserMessage } = useTranslation("userEntity", { keyPrefix: "messages" });
//   const { t: tInputValidation } = useTranslation("input", { keyPrefix: "validation" });
//   const { t: tUserGender } = useTranslation("userEntity", { keyPrefix: "constants.genders" });

//   const [defaultValues, setDefaultValues] = useState({
//     username: "",
//     phoneNumber: "",
//     email: "",
//     name: "",
//     address: "",
//     gender: "",
//     role: "",
//     status: "",
//     dob: "",
//     description: "",
//     education: "",
//     certificate: "",
//     expertises: []
//   });

//   const theme = useTheme();

//   const changeAvatarModal = useCustomModal();
//   const addExpertiseModal = useCustomModal();
//   const notHaveAccessModal = useCustomModal();
//   const editUserRoleModal = useCustomModal();
//   const blockUserModal = useCustomModal();
//   const unblockUserModal = useCustomModal();

//   const params = useParams();
//   const userId = useMemo(() => params?.userId, [params?.userId]);

//   const authStore = useAuthStore();

//   const { isLoading, fetchApi } = useFetchingStore();

//   const expertiseListObj = useMemo(() => {
//     return expertisesList.reduce((obj, cur) => {
//       return {
//         ...obj,
//         [cur?.id]: cur
//       };
//     }, {});
//   }, [expertisesList]);

//   const userGendersList = useMemo(
//     () => [
//       {
//         value: userGenders.MALE,
//         label: "male"
//       },
//       {
//         value: userGenders.FEMALE,
//         label: "female"
//       },
//       {
//         value: userGenders.OTHER,
//         label: "other"
//       }
//     ],
//     []
//   );

//   const userGendersListObj = useMemo(() => {
//     return userGendersList.reduce((obj, cur) => {
//       return {
//         ...obj,
//         [cur?.value]: cur
//       };
//     }, {});
//   }, [userGendersList]);

//   const { control, trigger, watch, reset, handleSubmit } = useForm({
//     mode: "onChange",
//     defaultValues,
//     criteriaMode: "all"
//   });

//   const navigate = useNavigate();

//   const loadData = async () => {
//     await fetchApi(async () => {
//       const res = await userServices.getUserDetail(userId);

//       if (res.success) {
//         const userData = new User(res.user);
//         setUser(userData);

//         const expertiseIds = userData?.expertises?.map((expertise) => expertise?.id) || [];

//         const newDefaultValues = {
//           ...mergeObjectsWithoutNullAndUndefined(defaultValues, userData),
//           expertises: expertiseIds,
//           status: userData?.blocked ? userStatus.STATUS_BLOCK : userStatus.STATUS_UNBLOCK
//           // gender: ""
//         };

//         setDefaultValues(newDefaultValues);
//         reset(newDefaultValues);

//         return { success: true };
//       }
//       setUser({});
//       return { error: res.message };
//     });
//   };
//   useEffect(() => {
//     loadData();
//   }, [userId]);

//   const ability = useAbility(AbilityContext);

//   const canUpdateUser = ability.can(userActionAbility.UPDATE, user);
//   const canUpdateUserRole = ability.can(userActionAbility.UPDATE_ROLE, user);
//   const canAddExpertise = ability.can(expertiseActionAbility.ADD, Expertise.magicWord());

//   const handleSaveDetail = async ({
//     // username,
//     phoneNumber,
//     // email,
//     name,
//     address,
//     gender,
//     status,
//     dob,
//     description,
//     education,
//     certificate,
//     expertises
//   }) => {
//     const data = {
//       phoneNumber,
//       name,
//       address,
//       gender,
//       status,
//       dob,
//       description,
//       education,
//       certificate,
//       expertises
//     };

//     if (canUpdateUser) {
//       await fetchApi(async () => {
//         let res = {
//           message: ""
//         };
//         if (authStore.user?.id === user.id) {
//           res = await userServices.editMyProfile(data);
//         } else {
//           res = await userServices.editUserInfo(data);
//         }

//         if (res?.success) {
//           // await authStore.loadUserInfo();
//           return { success: true };
//         }
//         // setExpertisesList([]);
//         // setIsFetchConfigSuccess(true);
//         toast(res.message);
//         return { error: res.message };
//       });
//     }
//   };

//   const handleAfterAddExpertise = async () => {
//     await loadExpertisesList();
//   };

//   const handleAfterEditUserRole = async () => {
//     await loadData();
//   };

//   const handleAfterBlockUser = async () => {
//     await loadData();
//   };

//   const handleAfterUnblockUser = async () => {
//     await loadData();
//   };

//   return (
//     <>
//       <Box
//         sx={{
//           border: "1px solid rgba(0,0,0,0.1)",
//           borderRadius: 4,
//           px: {
//             xl: 8,
//             lg: 6,
//             md: 0
//           },
//           pt: 5,
//           pb: 10,
//           position: "relative"
//         }}
//       >
//         <CustomOverlay open={isLoading} />

//         <Button
//           variant="contained"
//           onClick={() => {
//             navigate(`${routeConfig.user}/${userId}${userDetailRoutes.schedule}`);
//           }}
//           sx={{
//             position: "absolute",
//             top: 0,
//             right: 0,
//             bgcolor: theme.palette.success.light
//           }}
//           startIcon={<CalendarMonthIcon sx={{ color: theme.palette.success.contrastText }} />}
//         >
//           {t("schedule_btn")}
//         </Button>

//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center"
//           }}
//         >
//           <Card
//             sx={{
//               boxShadow: "none"
//             }}
//           >
//             <CardHeader
//               avatar={
//                 <Avatar
//                   onClick={() => {
//                     changeAvatarModal.setShow(true);
//                     changeAvatarModal.setData(user);
//                   }}
//                   sx={{ width: 150, height: 150, cursor: "pointer" }}
//                   alt={user?.name}
//                   src={user?.image}
//                 />
//               }
//               title={user?.name}
//               subheader={user?.id}
//             />
//           </Card>
//         </Box>

//         <Box sx={{ mb: 4 }}>
//           <Typography variant="h4" sx={{ mb: 4 }}>
//             {t("title.identify")}
//           </Typography>
//           <Grid container spacing={3}>
//             <Grid item xs={12} sm={12} md={4} lg={4}>
//               <CustomInput
//                 disabled={!canUpdateUser}
//                 showCanEditIcon
//                 control={control}
//                 rules={{
//                   required: tInputValidation("required"),
//                   pattern: {
//                     value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
//                     message: tInputValidation("format")
//                   },
//                   maxLength: {
//                     value: userInputValidate.STAFF_EMAIL_MAX_LENGTH,
//                     message: tInputValidation("maxLength", {
//                       maxLength: userInputValidate.STAFF_EMAIL_MAX_LENGTH
//                     })
//                   }
//                 }}
//                 label={tUser("email")}
//                 trigger={trigger}
//                 name="email"
//                 type="email"
//                 message={
//                   user?.emailVerified && user?.email === watch().email
//                     ? {
//                         type: "success",
//                         text: tUserMessage("emailVerifiedSuccess")
//                       }
//                     : {
//                         type: "error",
//                         text: tUserMessage("emailVerifiedFailed")
//                       }
//                 }
//               />
//             </Grid>
//             <Grid item xs={12} sm={12} md={4} lg={4}>
//               <CustomInput
//                 disabled={!canUpdateUser}
//                 showCanEditIcon
//                 control={control}
//                 rules={{
//                   required: tInputValidation("required"),
//                   maxLength: {
//                     value: userInputValidate.STAFF_USERNAME_MAX_LENGTH,
//                     message: tInputValidation("maxLength", {
//                       maxLength: userInputValidate.STAFF_USERNAME_MAX_LENGTH
//                     })
//                   }
//                 }}
//                 label={tUser("username")}
//                 trigger={trigger}
//                 name="username"
//                 type="text"
//               />
//             </Grid>
//             <Grid item xs={12} sm={12} md={4} lg={4}>
//               <CustomInput
//                 disabled={!canUpdateUser}
//                 showCanEditIcon
//                 control={control}
//                 rules={{
//                   required: tInputValidation("required"),
//                   pattern: {
//                     value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
//                     message: tInputValidation("format")
//                   }
//                 }}
//                 label={tUser("phoneNumber")}
//                 trigger={trigger}
//                 name="phoneNumber"
//                 type="phone"
//                 message={
//                   user?.phoneVerified && user?.phoneNumber === watch().phoneNumber
//                     ? {
//                         type: "success",
//                         text: tUserMessage("phoneVerifiedSuccess")
//                       }
//                     : {
//                         type: "error",
//                         text: tUserMessage("phoneVerifiedFailed")
//                       }
//                 }
//               />
//             </Grid>
//           </Grid>
//         </Box>

//         <Box sx={{ mb: 4 }}>
//           <Typography variant="h4" sx={{ mb: 4 }}>
//             {t("title.account")}
//           </Typography>
//           <Grid container spacing={3}>
//             <Grid item xs={12} sm={12} md={6} lg={6}>
//               <CustomInput
//                 disabled
//                 showCanEditIcon
//                 control={control}
//                 label={tUser("role")}
//                 trigger={trigger}
//                 name="role"
//                 type="text"
//                 InputProps={
//                   canUpdateUserRole && {
//                     endAdornment: (
//                       <InputAdornment position="end">
//                         <FontAwesomeIcon
//                           size="1x"
//                           icon={faGearIcon}
//                           onClick={() => {
//                             editUserRoleModal.setShow(true);
//                             editUserRoleModal.setData(user);
//                           }}
//                           cursor="pointer"
//                           color={theme.palette.success.light}
//                         />
//                       </InputAdornment>
//                     )
//                   }
//                 }
//               />
//             </Grid>
//             <Grid item xs={12} sm={12} md={6} lg={6}>
//               <CustomInput
//                 disabled
//                 showCanEditIcon
//                 control={control}
//                 label={tUser("status")}
//                 trigger={trigger}
//                 name="status"
//                 type="text"
//                 InputProps={
//                   canUpdateUserRole && {
//                     endAdornment: (
//                       <InputAdornment position="end">
//                         {user.blocked ? (
//                           <FontAwesomeIcon
//                             size="1x"
//                             icon={faGearIcon}
//                             onClick={() => {
//                               unblockUserModal.setShow(true);
//                               unblockUserModal.setData(user);
//                             }}
//                             cursor="pointer"
//                             color={theme.palette.error.light}
//                           />
//                         ) : (
//                           <FontAwesomeIcon
//                             size="1x"
//                             icon={faGearIcon}
//                             onClick={() => {
//                               blockUserModal.setShow(true);
//                               blockUserModal.setData(user);
//                             }}
//                             cursor="pointer"
//                             color={theme.palette.success.light}
//                           />
//                         )}
//                       </InputAdornment>
//                     )
//                   }
//                 }
//               />
//             </Grid>
//           </Grid>
//         </Box>

//         <Box sx={{ mb: 4 }}>
//           <Typography variant="h4" sx={{ mb: 4 }}>
//             {t("title.personality")}
//           </Typography>
//           <Grid container spacing={3}>
//             <Grid item xs={12} sm={12} md={12} lg={8}>
//               <CustomInput
//                 disabled={!canUpdateUser}
//                 showCanEditIcon
//                 control={control}
//                 rules={{
//                   required: tInputValidation("required"),
//                   maxLength: {
//                     value: userInputValidate.STAFF_NAME_MAX_LENGTH,
//                     message: tInputValidation("maxLength", {
//                       maxLength: userInputValidate.STAFF_NAME_MAX_LENGTH
//                     })
//                   }
//                 }}
//                 label={tUser("name")}
//                 trigger={trigger}
//                 name="name"
//                 type="text"
//               />
//             </Grid>

//             <Grid item xs={12} sm={12} md={6} lg={2}>
//               <CustomInput
//                 disabled={!canUpdateUser}
//                 showCanEditIcon
//                 control={control}
//                 rules={{
//                   required: tInputValidation("required")
//                 }}
//                 label={tUser("dob")}
//                 trigger={trigger}
//                 name="dob"
//                 type="date"
//               />
//             </Grid>

//             <Grid item xs={12} sm={12} md={6} lg={2}>
//               <CustomInput
//                 disabled={!canUpdateUser}
//                 showCanEditIcon
//                 control={control}
//                 rules={{
//                   required: tInputValidation("required"),
//                   maxLength: {
//                     value: userInputValidate.STAFF_GENDER_MAX_LENGTH,
//                     message: tInputValidation("maxLength", {
//                       maxLength: userInputValidate.STAFF_GENDER_MAX_LENGTH
//                     })
//                   }
//                 }}
//                 label={tUser("gender")}
//                 trigger={trigger}
//                 name="gender"
//                 childrenType="select"
//               >
//                 <Select
//                   renderValue={(selected) => {
//                     return tUserGender(userGendersListObj[selected]?.label);
//                   }}
//                 >
//                   {userGendersList.map((item) => {
//                     return (
//                       <MenuItem key={item?.value} value={item?.value}>
//                         <ListItemText primary={tUserGender(item?.label)} />
//                       </MenuItem>
//                     );
//                   })}
//                 </Select>
//               </CustomInput>
//             </Grid>

//             <Grid item xs={12} sm={12} md={12} lg={12}>
//               <CustomInput
//                 disabled={!canUpdateUser}
//                 showCanEditIcon
//                 control={control}
//                 rules={{
//                   maxLength: {
//                     value: userInputValidate.STAFF_ADDRESS_MAX_LENGTH,
//                     message: tInputValidation("maxLength", {
//                       maxLength: userInputValidate.STAFF_ADDRESS_MAX_LENGTH
//                     })
//                   }
//                 }}
//                 label={tUser("address")}
//                 trigger={trigger}
//                 name="address"
//                 type="text"
//                 multiline
//                 rows={6}
//               />
//             </Grid>
//           </Grid>
//         </Box>

//         <Box sx={{ mb: 4 }}>
//           <Typography variant="h4" sx={{ mb: 4 }}>
//             {t("title.doctor")}
//           </Typography>
//           <Grid container spacing={3}>
//             <Grid item xs={12} sm={12} md={6} lg={6}>
//               <CustomInput
//                 disabled={!canUpdateUser}
//                 showCanEditIcon
//                 control={control}
//                 rules={{
//                   maxLength: {
//                     value: userInputValidate.STAFF_EDUCATION_MAX_LENGTH,
//                     message: tInputValidation("maxLength", {
//                       maxLength: userInputValidate.STAFF_EDUCATION_MAX_LENGTH
//                     })
//                   }
//                 }}
//                 label={tUser("education")}
//                 trigger={trigger}
//                 name="education"
//                 type="text"
//                 multiline
//                 rows={2}
//               />
//             </Grid>

//             <Grid item xs={12} sm={12} md={6} lg={6}>
//               <CustomInput
//                 disabled={!canUpdateUser}
//                 showCanEditIcon
//                 control={control}
//                 rules={{
//                   maxLength: {
//                     value: userInputValidate.STAFF_CERTIFICATE_MAX_LENGTH,
//                     message: tInputValidation("maxLength", {
//                       maxLength: userInputValidate.STAFF_CERTIFICATE_MAX_LENGTH
//                     })
//                   }
//                 }}
//                 label={tUser("certificate")}
//                 trigger={trigger}
//                 name="certificate"
//                 type="text"
//                 multiline
//                 rows={2}
//               />
//             </Grid>

//             <Grid item xs={12} sm={12} md={12} lg={12}>
//               <CustomInput
//                 disabled={!canUpdateUser}
//                 showCanEditIcon
//                 control={control}
//                 rules={{
//                   maxLength: {
//                     value: userInputValidate.STAFF_DESCRIPTION_MAX_LENGTH,
//                     message: tInputValidation("maxLength", {
//                       maxLength: userInputValidate.STAFF_DESCRIPTION_MAX_LENGTH
//                     })
//                   }
//                 }}
//                 label={tUser("description")}
//                 trigger={trigger}
//                 name="description"
//                 type="text"
//                 multiline
//                 rows={6}
//               />
//             </Grid>
//             <Grid
//               item
//               xs={12}
//               sm={12}
//               md={12}
//               lg={12}
//               sx={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "flex-start"
//               }}
//             >
//               <CustomInput
//                 disabled={!canUpdateUser}
//                 showCanEditIcon
//                 control={control}
//                 rules={{}}
//                 label={tUser("expertises")}
//                 trigger={trigger}
//                 name="expertises"
//                 childrenType="select"
//               >
//                 <Select
//                   multiple
//                   renderValue={(selected) => {
//                     // if (Array.isArray(selected)) {
//                     //   const selectedValues = selected.map((key) => expertiseListObj[key]?.name);

//                     //   return (
//                     //     < >
//                     //       <List dense disablePadding>
//                     //         {selectedValues.map((value) => (
//                     //           <ListItem key={value}>
//                     //             <ListItemText primary={<Typography>{value}</Typography>} />
//                     //           </ListItem>
//                     //         ))}
//                     //       </List>
//                     //     </>
//                     //   );
//                     // }
//                     // return selected;

//                     if (Array.isArray(selected)) {
//                       const selectedValue = selected
//                         ?.map((cur) => {
//                           return expertiseListObj[cur]?.name;
//                         })
//                         ?.join(", ");
//                       return (
//                         <div
//                           style={{
//                             overflow: "auto",
//                             whiteSpace: "pre-wrap"
//                           }}
//                         >
//                           {selectedValue}
//                         </div>
//                       );
//                     }

//                     return selected;

//                     // if (Array.isArray(selected))
//                     //   return selected?.map((cur) => {
//                     //     return <p>{expertiseListObj[cur]?.name}</p>;
//                     //   });
//                   }}
//                 >
//                   {expertisesList.map((item) => {
//                     return (
//                       <MenuItem key={item?.id} value={item?.id}>
//                         <Checkbox checked={watch().expertises?.indexOf(item?.id) > -1} />
//                         <ListItemText primary={item?.name} />
//                       </MenuItem>
//                     );
//                   })}
//                 </Select>
//               </CustomInput>

//               <IconButton
//                 onClick={() => {
//                   if (canAddExpertise) {
//                     addExpertiseModal.setShow(true);
//                   } else {
//                     notHaveAccessModal.setShow(true);
//                   }
//                 }}
//               >
//                 <AddIcon />
//               </IconButton>
//             </Grid>
//           </Grid>
//         </Box>

//         {canUpdateUser && (
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "flex-end"
//             }}
//           >
//             <Button
//               variant="contained"
//               onClick={() => {
//                 reset(defaultValues);
//               }}
//               sx={{
//                 ml: 2,
//                 bgcolor: theme.palette.warning.light
//               }}
//               startIcon={<RestartAltIcon color={theme.palette.warning.contrastText} />}
//             >
//               {tBtn("reset")}
//             </Button>

//             <Button
//               variant="contained"
//               onClick={handleSubmit(handleSaveDetail)}
//               sx={{
//                 ml: 2,
//                 bgcolor: theme.palette.success.light
//               }}
//               startIcon={<SaveIcon color={theme.palette.success.contrastText} />}
//             >
//               {tBtn("save")}
//             </Button>
//           </Box>
//         )}
//       </Box>

//       {editUserRoleModal.show && (
//         <EditUserRoleModal
//           show={editUserRoleModal.show}
//           setShow={editUserRoleModal.setShow}
//           data={editUserRoleModal.data}
//           setData={editUserRoleModal.setData}
//           handleAfterEditUserRole={handleAfterEditUserRole}
//         />
//       )}

//       {blockUserModal.show && (
//         <BlockUserModal
//           show={blockUserModal.show}
//           setShow={blockUserModal.setShow}
//           data={blockUserModal.data}
//           setData={blockUserModal.setData}
//           handleAfterBlockUser={handleAfterBlockUser}
//         />
//       )}

//       {unblockUserModal.show && (
//         <UnblockUserModal
//           show={unblockUserModal.show}
//           setShow={unblockUserModal.setShow}
//           data={unblockUserModal.data}
//           setData={unblockUserModal.setData}
//           handleAfterUnblockUser={handleAfterUnblockUser}
//         />
//       )}

//       {notHaveAccessModal.show && (
//         <NotHaveAccessModal
//           show={notHaveAccessModal.show}
//           setShow={notHaveAccessModal.setShow}
//           data={notHaveAccessModal.data}
//           setData={notHaveAccessModal.setData}
//         />
//       )}

//       {changeAvatarModal.show && (
//         <ChangeAvatarModal
//           show={changeAvatarModal.show}
//           setShow={changeAvatarModal.setShow}
//           data={changeAvatarModal.data}
//           setData={changeAvatarModal.setData}
//           disbled={!canUpdateUser}
//         />
//       )}

//       {addExpertiseModal.show && (
//         <AddExpertiseModal
//           show={addExpertiseModal.show}
//           setShow={addExpertiseModal.setShow}
//           handleAfterAddExpertise={handleAfterAddExpertise}
//         />
//       )}
//     </>
//   );
// }

// UserDetail.propTypes = {
//   expertisesList: PropTypes.array.isRequired,
//   loadExpertisesList: PropTypes.func.isRequired
// };

// export default WithExpertisesLoaderWrapper(UserDetail);

function UserDetail() {
  return <div />;
}

export default UserDetail;
