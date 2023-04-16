import React, { useEffect, useMemo, useState } from "react";

import {
  Grid,
  Button,
  Box,
  Typography,
  Avatar,
  Card,
  CardHeader,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  IconButton,
  InputAdornment,
  useTheme
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  Add as AddIcon,
  CalendarMonth as CalendarMonthIcon,
  RestartAlt as RestartAltIcon,
  Save as SaveIcon
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { useAbility } from "@casl/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear as faGearIcon } from "@fortawesome/free-solid-svg-icons";
import CustomInput from "../../components/CustomInput";

import staffServices from "../../services/staffServices";
import { useFetchingStore } from "../../store/FetchingApiStore/hooks";
import CustomOverlay from "../../components/CustomOverlay";
import ChangeAvatarModal from "./components/ChangeAvatarModal";
import { useCustomModal } from "../../components/CustomModal";
import AddExpertiseModal from "./components/AddExpertiseModal";
import { staffRoutes } from "../../pages/StaffPage";
import routeConfig from "../../config/routeConfig";
import Staff, { staffActionAbility, staffInputValidate } from "../../entities/Staff";
import { AbilityContext } from "../../store/AbilityStore";
import { NotHaveAccessModal } from "../auth";
import { Expertise, expertiseActionAbility } from "../../entities/Expertise";
import EditStaffRoleModal from "./components/EditStaffRoleModal";
import { mergeObjectsWithoutNullAndUndefined } from "../../utils/objectUtil";
import { useAuthStore } from "../../store/AuthStore";
import { EditStaffStatusModal } from "./components";

function StaffDetail() {
  const [staff, setStaff] = useState(new Staff());
  const [defaultValues, setDefaultValues] = useState({
    username: "",
    phoneNumber: "",
    email: "",
    name: "",
    address: "",
    gender: "",
    role: "",
    status: "",
    dob: new Date(),
    description: "",
    education: "",
    certificate: "",
    expertises: []
  });

  const theme = useTheme();

  const changeAvatarModal = useCustomModal();
  const addExpertiseModal = useCustomModal();
  const notHaveAccessModal = useCustomModal();
  const editStaffRoleModal = useCustomModal();
  const editStaffStatusModal = useCustomModal();

  const params = useParams();
  const staffId = useMemo(() => params?.staffId, [params?.staffId]);

  const authStore = useAuthStore();

  const [isFetchConfigSuccess, setIsFetchConfigSuccess] = useState(false);
  const { isLoading, fetchApi } = useFetchingStore();

  const [expertisesList, setExpertisesList] = useState([]);
  const expertiseListObj = useMemo(() => {
    return expertisesList.reduce((obj, cur) => {
      return {
        ...obj,
        [cur?.id]: cur
      };
    }, {});
  }, [expertisesList]);

  const gendersList = useMemo(
    () => [
      {
        value: "Male",
        label: "male"
      },
      {
        value: "Female",
        label: "female"
      }
    ],
    []
  );

  const { control, trigger, watch, reset, handleSubmit } = useForm({
    mode: "onChange",
    defaultValues,
    criteriaMode: "all"
  });

  const navigate = useNavigate();

  const { t } = useTranslation("staffFeature", { keyPrefix: "staff_detail" });

  const loadData = async () => {
    await fetchApi(async () => {
      const res = await staffServices.getStaffDetail(staffId);

      if (res.success) {
        const staffData = new Staff(res.staff);
        setStaff(staffData);

        const expertiseIds = staffData?.expertises?.map((expertise) => expertise?.id) || [];

        const newDefaultValues = {
          ...mergeObjectsWithoutNullAndUndefined(defaultValues, staffData),
          expertises: expertiseIds
          // gender: ""
        };

        setDefaultValues(newDefaultValues);
        reset(newDefaultValues);

        return { success: true };
      }
      setStaff({});
      return { error: res.message };
    });
  };
  useEffect(() => {
    loadData();
  }, [staffId]);

  const loadExpertises = async () => {
    await fetchApi(async () => {
      const res = await staffServices.getStaffExpertises();

      if (res.success) {
        const expertisesData = res?.expertises;
        setExpertisesList(expertisesData);
        setIsFetchConfigSuccess(true);
        return { success: true };
      }
      setExpertisesList([]);
      setIsFetchConfigSuccess(true);
      return { error: res.message };
    });
  };

  // console.log("exper: ", expertisesList);

  const loadConfig = async () => {
    await loadExpertises();
  };

  useEffect(() => {
    loadConfig();
  }, []);

  // console.log("expertiseListObj: ", expertiseListObj);
  // console.log("expertisesList: ", expertisesList);

  const ability = useAbility(AbilityContext);

  const canUpdateStaff = ability.can(staffActionAbility.UPDATE, staff);
  const canUpdateStaffRole = ability.can(staffActionAbility.UPDATE_ROLE, staff);
  const canAddExpertise = ability.can(expertiseActionAbility.ADD, Expertise.magicWord());

  const handleSaveDetail = async (data) => {
    if (canUpdateStaff) {
      await fetchApi(async () => {
        let res = {
          message: ""
        };
        if (authStore.staff?.id === staff.id) {
          res = await staffServices.editMyProfile(data);
        } else {
          res = await staffServices.editStaffInfo(data);
        }

        if (res?.success) {
          return { success: true };
        }
        // setExpertisesList([]);
        // setIsFetchConfigSuccess(true);
        toast(res.message);
        return { error: res.message };
      });
    }
  };

  const handleAfterAddExpertise = async () => {
    await loadExpertises();
  };

  const handleAfterEditStaffRole = async () => {
    await loadData();
  };

  const handleAfterEditStaffStatus = async () => {
    await loadData();
  };

  return (
    isFetchConfigSuccess && (
      <>
        <Box
          sx={{
            border: "1px solid rgba(0,0,0,0.1)",
            borderRadius: 4,
            px: {
              xl: 8,
              lg: 6,
              md: 0
            },
            pt: 5,
            pb: 10,
            position: "relative"
          }}
        >
          <CustomOverlay open={isLoading} />

          <Button
            variant="contained"
            onClick={() => navigate(`${routeConfig.staff}/${staffId}${staffRoutes.schedule}`, { relative: true })}
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              bgcolor: theme.palette.success.light
            }}
            startIcon={<CalendarMonthIcon sx={{ color: theme.palette.success.contrastText }} />}
          >
            {t("schedule_btn")}
          </Button>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Card
              sx={{
                boxShadow: "none"
              }}
            >
              <CardHeader
                avatar={
                  <Avatar
                    onClick={() => {
                      changeAvatarModal.setShow(true);
                      changeAvatarModal.setData(staff);
                    }}
                    sx={{ width: 150, height: 150, cursor: "pointer" }}
                    alt={staff?.name}
                    src={staff?.image}
                  />
                }
                title={staff?.name}
                subheader={staff?.id}
              />
            </Card>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ mb: 4 }}>
              {t("title.identify")}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <CustomInput
                  disabled={!canUpdateStaff}
                  showCanEditIcon
                  control={control}
                  rules={{
                    required: t("input_validation.required"),
                    pattern: {
                      value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                      message: t("input_validation.format")
                    },
                    maxLength: {
                      value: staffInputValidate.STAFF_EMAIL_MAX_LENGTH,
                      message: t("input_validation.max_length", {
                        maxLength: staffInputValidate.STAFF_EMAIL_MAX_LENGTH
                      })
                    }
                  }}
                  label={t("email")}
                  trigger={trigger}
                  name="email"
                  type="email"
                  message={
                    staff?.emailVerified && staff?.email === watch().email
                      ? {
                          type: "success",
                          text: t("email_verified_success")
                        }
                      : {
                          type: "error",
                          text: t("email_verified_failed")
                        }
                  }
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <CustomInput
                  disabled={!canUpdateStaff}
                  showCanEditIcon
                  control={control}
                  rules={{
                    required: t("input_validation.required"),
                    maxLength: {
                      value: staffInputValidate.STAFF_USERNAME_MAX_LENGTH,
                      message: t("input_validation.max_length", {
                        maxLength: staffInputValidate.STAFF_USERNAME_MAX_LENGTH
                      })
                    }
                  }}
                  label={t("username")}
                  trigger={trigger}
                  name="username"
                  type="text"
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <CustomInput
                  disabled={!canUpdateStaff}
                  showCanEditIcon
                  control={control}
                  rules={{
                    required: t("input_validation.required")
                  }}
                  label={t("phone")}
                  trigger={trigger}
                  name="phoneNumber"
                  type="phone"
                  message={
                    staff?.phoneVerified && staff?.phoneNumber === watch().phoneNumber
                      ? {
                          type: "success",
                          text: t("phone_verified_success")
                        }
                      : {
                          type: "error",
                          text: t("phone_verified_failed")
                        }
                  }
                />
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ mb: 4 }}>
              {t("title.account")}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <CustomInput
                  disabled
                  showCanEditIcon
                  control={control}
                  label={t("role")}
                  trigger={trigger}
                  name="role"
                  type="text"
                  InputProps={
                    canUpdateStaffRole && {
                      endAdornment: (
                        <InputAdornment position="end">
                          <FontAwesomeIcon
                            size="1x"
                            icon={faGearIcon}
                            onClick={() => {
                              editStaffRoleModal.setShow(true);
                              editStaffRoleModal.setData(staff);
                            }}
                            cursor="pointer"
                            color={theme.palette.success.light}
                          />
                        </InputAdornment>
                      )
                    }
                  }
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <CustomInput
                  disabled
                  showCanEditIcon
                  control={control}
                  label={t("status")}
                  trigger={trigger}
                  name="status"
                  type="text"
                  InputProps={
                    canUpdateStaffRole && {
                      endAdornment: (
                        <InputAdornment position="end">
                          <FontAwesomeIcon
                            size="1x"
                            icon={faGearIcon}
                            onClick={() => {
                              editStaffStatusModal.setShow(true);
                              editStaffStatusModal.setData(staff);
                            }}
                            cursor="pointer"
                            color={theme.palette.success.light}
                          />
                        </InputAdornment>
                      )
                    }
                  }
                />
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ mb: 4 }}>
              {t("title.personality")}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12} md={12} lg={8}>
                <CustomInput
                  disabled={!canUpdateStaff}
                  showCanEditIcon
                  control={control}
                  rules={{
                    required: t("input_validation.required"),
                    maxLength: {
                      value: staffInputValidate.STAFF_NAME_MAX_LENGTH,
                      message: t("input_validation.max_length", {
                        maxLength: staffInputValidate.STAFF_NAME_MAX_LENGTH
                      })
                    }
                  }}
                  label={t("name")}
                  trigger={trigger}
                  name="name"
                  type="text"
                />
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={2}>
                <CustomInput
                  disabled={!canUpdateStaff}
                  showCanEditIcon
                  control={control}
                  rules={{
                    required: t("input_validation.required")
                  }}
                  label={t("dob")}
                  trigger={trigger}
                  name="dob"
                  type="date"
                />
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={2}>
                <CustomInput
                  disabled={!canUpdateStaff}
                  showCanEditIcon
                  control={control}
                  rules={{
                    required: t("input_validation.required"),
                    maxLength: {
                      value: staffInputValidate.STAFF_GENDER_MAX_LENGTH,
                      message: t("input_validation.max_length", {
                        maxLength: staffInputValidate.STAFF_GENDER_MAX_LENGTH
                      })
                    }
                  }}
                  label={t("gender")}
                  trigger={trigger}
                  name="gender"
                  childrenType="select"
                >
                  <Select renderValue={(selected) => selected}>
                    {gendersList.map((item) => {
                      return (
                        <MenuItem key={item?.value} value={item?.value}>
                          <ListItemText primary={t(item?.label)} />
                        </MenuItem>
                      );
                    })}
                  </Select>
                </CustomInput>
              </Grid>

              <Grid item xs={12} sm={12} md={12} lg={12}>
                <CustomInput
                  disabled={!canUpdateStaff}
                  showCanEditIcon
                  control={control}
                  rules={{
                    maxLength: {
                      value: staffInputValidate.STAFF_ADDRESS_MAX_LENGTH,
                      message: t("input_validation.max_length", {
                        maxLength: staffInputValidate.STAFF_ADDRESS_MAX_LENGTH
                      })
                    }
                  }}
                  label={t("address")}
                  trigger={trigger}
                  name="address"
                  type="text"
                  multiline
                  rows={6}
                />
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ mb: 4 }}>
              {t("title.doctor")}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <CustomInput
                  disabled={!canUpdateStaff}
                  showCanEditIcon
                  control={control}
                  rules={{
                    maxLength: {
                      value: staffInputValidate.STAFF_EDUCATION_MAX_LENGTH,
                      message: t("input_validation.max_length", {
                        maxLength: staffInputValidate.STAFF_EDUCATION_MAX_LENGTH
                      })
                    }
                  }}
                  label={t("education")}
                  trigger={trigger}
                  name="education"
                  type="text"
                  multiline
                  rows={2}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={6}>
                <CustomInput
                  disabled={!canUpdateStaff}
                  showCanEditIcon
                  control={control}
                  rules={{
                    maxLength: {
                      value: staffInputValidate.STAFF_CERTIFICATE_MAX_LENGTH,
                      message: t("input_validation.max_length", {
                        maxLength: staffInputValidate.STAFF_CERTIFICATE_MAX_LENGTH
                      })
                    }
                  }}
                  label={t("certificate")}
                  trigger={trigger}
                  name="certificate"
                  type="text"
                  multiline
                  rows={2}
                />
              </Grid>

              {/* <Grid item xs={12} sm={12} md={12} lg={12}>
                <CustomInput
                  disabled={!canUpdateStaff}
                  showCanEditIcon
                  control={control}
                  rules={{
                    maxLength: {
                      value: staffInputValidate.STAFF_DESCRIPTION_MAX_LENGTH,
                      message: t("input_validation.max_length", {
                        maxLength: staffInputValidate.STAFF_DESCRIPTION_MAX_LENGTH
                      })
                    }
                  }}
                  label={t("description")}
                  trigger={trigger}
                  name="description"
                  type="text"
                  multiline
                  rows={6}
                />
              </Grid> */}
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start"
                }}
              >
                <CustomInput
                  disabled={!canUpdateStaff}
                  showCanEditIcon
                  control={control}
                  rules={{}}
                  label={t("expertises")}
                  trigger={trigger}
                  name="expertises"
                  childrenType="select"
                >
                  <Select
                    multiple
                    renderValue={(selected) => {
                      // if (Array.isArray(selected)) {
                      //   const selectedValues = selected.map((key) => expertiseListObj[key]?.name);

                      //   return (
                      //     < >
                      //       <List dense disablePadding>
                      //         {selectedValues.map((value) => (
                      //           <ListItem key={value}>
                      //             <ListItemText primary={<Typography>{value}</Typography>} />
                      //           </ListItem>
                      //         ))}
                      //       </List>
                      //     </>
                      //   );
                      // }
                      // return selected;

                      if (Array.isArray(selected)) {
                        const selectedValue = selected
                          ?.map((cur) => {
                            return expertiseListObj[cur]?.name;
                          })
                          ?.join(", ");
                        return (
                          <div
                            style={{
                              overflow: "auto",
                              whiteSpace: "pre-wrap"
                            }}
                          >
                            {selectedValue}
                          </div>
                        );
                      }

                      return selected;

                      // if (Array.isArray(selected))
                      //   return selected?.map((cur) => {
                      //     return <p>{expertiseListObj[cur]?.name}</p>;
                      //   });
                    }}
                  >
                    {expertisesList.map((item) => {
                      return (
                        <MenuItem key={item?.id} value={item?.id}>
                          <Checkbox checked={watch().expertises?.indexOf(item?.id) > -1} />
                          <ListItemText primary={item?.name} />
                        </MenuItem>
                      );
                    })}
                  </Select>
                </CustomInput>

                <IconButton
                  onClick={() => {
                    if (canAddExpertise) {
                      addExpertiseModal.setShow(true);
                    } else {
                      notHaveAccessModal.setShow(true);
                    }
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Box>

          {canUpdateStaff && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end"
              }}
            >
              <Button
                variant="contained"
                onClick={() => {
                  reset(defaultValues);
                }}
                sx={{
                  ml: 2,
                  bgcolor: theme.palette.warning.light
                }}
                startIcon={<RestartAltIcon color={theme.palette.warning.contrastText} />}
              >
                {t("reset_btn")}
              </Button>

              <Button
                variant="contained"
                onClick={handleSubmit(handleSaveDetail)}
                sx={{
                  ml: 2,
                  bgcolor: theme.palette.success.light
                }}
                startIcon={<SaveIcon color={theme.palette.success.contrastText} />}
              >
                {t("save_btn")}
              </Button>
            </Box>
          )}
        </Box>

        {editStaffRoleModal.show && (
          <EditStaffRoleModal
            show={editStaffRoleModal.show}
            setShow={editStaffRoleModal.setShow}
            data={editStaffRoleModal.data}
            setData={editStaffRoleModal.setData}
            handleAfterEditStaffRole={handleAfterEditStaffRole}
          />
        )}

        {editStaffStatusModal.show && (
          <EditStaffStatusModal
            show={editStaffStatusModal.show}
            setShow={editStaffStatusModal.setShow}
            data={editStaffStatusModal.data}
            setData={editStaffStatusModal.setData}
            handleAfterEditStaffStatus={handleAfterEditStaffStatus}
          />
        )}

        {notHaveAccessModal.show && (
          <NotHaveAccessModal
            show={notHaveAccessModal.show}
            setShow={notHaveAccessModal.setShow}
            data={notHaveAccessModal.data}
            setData={notHaveAccessModal.setData}
          />
        )}

        {changeAvatarModal.show && (
          <ChangeAvatarModal
            show={changeAvatarModal.show}
            setShow={changeAvatarModal.setShow}
            data={changeAvatarModal.data}
            setData={changeAvatarModal.setData}
            disbled={!canUpdateStaff}
          />
        )}

        {addExpertiseModal.show && (
          <AddExpertiseModal
            show={addExpertiseModal.show}
            setShow={addExpertiseModal.setShow}
            handleAfterAddExpertise={handleAfterAddExpertise}
          />
        )}
      </>
    )
  );
}
export default StaffDetail;
