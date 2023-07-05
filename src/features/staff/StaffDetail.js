import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

import { Grid, Select, MenuItem, Checkbox, ListItemText, InputAdornment, useTheme, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useAbility } from "@casl/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear as faGearIcon } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { subject } from "@casl/ability";
import CustomInput from "../../components/CustomInput";

import staffServices from "../../services/staffServices";
import { useFetchingStore } from "../../store/FetchingApiStore/hooks";
import CustomOverlay from "../../components/CustomOverlay";
import ChangeAvatarModal from "./components/ChangeAvatarModal";
import { useCustomModal } from "../../components/CustomModal";
import Staff, {
  staffActionAbility,
  staffGenders,
  staffInputValidate,
  staffRoles,
  staffStatuses
} from "../../entities/Staff";
import { AbilityContext } from "../../store/AbilityStore";
import { NotHaveAccessModal } from "../auth";
import EditStaffRoleModal from "./components/EditStaffRoleModal";
import { mergeObjectsWithoutNullAndUndefined } from "../../utils/objectUtil";
import { useAuthStore } from "../../store/AuthStore";
import { BlockStaffModal } from "./components";
import { WithExpertisesLoaderWrapper } from "./hocs";
import UnblockStaffModal from "./components/UnblockStaffModal";
import SectionContent from "../../components/SectionContent";
import PersonDetailWrapper from "../../components/PersonDetailWrapper/PersonDetailWrapper";
import routeConfig from "../../config/routeConfig";
import entities from "../../entities/entities";
import { useStaffRolesContantTranslation, useStaffStatusesContantTranslation } from "./hooks/useStaffConstantsTranslation";

function StaffDetail({ staff, loadData, expertisesList }) {
  // const [staff, setStaff] = useState();

  const { t } = useTranslation("staffFeature", { keyPrefix: "StaffDetail" });

  const { t: tStaff } = useTranslation("staffEntity", { keyPrefix: "properties" });
  const { t: tStaffMessage } = useTranslation("staffEntity", { keyPrefix: "messages" });
  const { t: tInputValidation } = useTranslation("input", { keyPrefix: "validation" });
  const { t: tStaffGender } = useTranslation("staffEntity", { keyPrefix: "constants.genders" });

  const [defaultValues, setDefaultValues] = useState({
    username: "",
    phoneNumber: "",
    email: "",
    name: "",
    address: "",
    gender: "",
    role: "",
    status: "",
    dob: "",
    description: "",
    education: "",
    certificate: "",
    healthInsurance: "",
    expertises: []
  });

  const navigate = useNavigate();
  const theme = useTheme();

  const changeAvatarModal = useCustomModal();
  const notHaveAccessModal = useCustomModal();
  const editStaffRoleModal = useCustomModal();
  const blockStaffModal = useCustomModal();
  const unblockStaffModal = useCustomModal();

  const authStore = useAuthStore();

  const { isLoading, fetchApi } = useFetchingStore();

  const expertiseListObj = useMemo(() => {
    return expertisesList.reduce((obj, cur) => {
      return {
        ...obj,
        [cur?.id]: cur
      };
    }, {});
  }, [expertisesList]);

  const staffGendersList = useMemo(
    () => [
      {
        value: staffGenders.MALE,
        label: "male"
      },
      {
        value: staffGenders.FEMALE,
        label: "female"
      },
      {
        value: staffGenders.OTHER,
        label: "other"
      }
    ],
    []
  );

  const staffGendersListObj = useMemo(() => {
    return staffGendersList.reduce((obj, cur) => {
      return {
        ...obj,
        [cur?.value]: cur
      };
    }, {});
  }, [staffGendersList]);

  const [, staffRoleContantListObj] = useStaffRolesContantTranslation();
  const [, staffStatusContantListObj] = useStaffStatusesContantTranslation();

  const { control, trigger, watch, reset, handleSubmit } = useForm({
    mode: "onChange",
    defaultValues,
    criteriaMode: "all"
  });

  // const loadData = async () => {
  //   await fetchApi(async () => {
  //     const res = await staffServices.getStaffDetail(staffId);

  //     if (res.success) {
  //       const staffData = new Staff(res.staff);

  //       setStaff(staffData);

  //       const expertiseIds = staffData?.expertises?.map((expertise) => expertise?.id) || [];

  //       const newDefaultValues = {
  //         ...mergeObjectsWithoutNullAndUndefined(defaultValues, staffData),
  //         expertises: expertiseIds,
  //         status: staffData?.blocked ? staffStatuses.STATUS_BLOCK : staffStatuses.STATUS_UNBLOCK
  //         // gender: ""
  //       };

  //       setDefaultValues(newDefaultValues);
  //       reset(newDefaultValues);

  //       return { ...res };
  //     }
  //     setStaff({});
  //     return { ...res };
  //   });
  // };
  // useEffect(() => {
  //   loadData();
  // }, [staffId]);

  useEffect(() => {
    // console.log("useEffect: ");
    if (staff && staff?.id) {
      // console.log("staff change: ", staff);
      const staffData = new Staff(staff);

      // setStaff(staffData);
      const expertiseIds = staffData?.expertises?.map((expertise) => expertise?.id) || [];
      const newDefaultValues = {
        ...mergeObjectsWithoutNullAndUndefined(defaultValues, staffData),
        expertises: expertiseIds,
        status: staffData?.blocked
          ? staffStatusContantListObj[staffStatuses.STATUS_BLOCK]?.label
          : staffStatusContantListObj[staffStatuses.STATUS_UNBLOCK]?.label,
        role: staffRoleContantListObj?.[staffData?.role]?.label || ""

        // gender: ""
      };
      setDefaultValues(newDefaultValues);
      reset(newDefaultValues);
    }
  }, [staff]);

  const ability = useAbility(AbilityContext);

  const canUpdateStaff = ability.can(staffActionAbility.UPDATE, subject(entities.STAFF, staff));
  const canUpdateStaffRole = ability.can(staffActionAbility.UPDATE_ROLE, subject(entities.STAFF, staff));
  const canUpdateStaffExpertise = ability.can(staffActionAbility.UPDATE_DOCTOR_EXPERTISES, subject(entities.STAFF, staff));
  const canBlockStaff = ability.can(staffActionAbility.BLOCK, subject(entities.STAFF, staff));

  const handleSaveDetail = async ({
    username,
    phoneNumber,
    email,
    name,
    address,
    gender,
    status,
    dob,
    description,
    education,
    certificate,
    healthInsurance,
    expertises
  }) => {
    const data = {
      username,
      phoneNumber,
      email,
      name,
      address,
      gender,
      status,
      dob,
      description,
      education,
      certificate,
      healthInsurance,
      expertises
    };

    if (canUpdateStaff) {
      await fetchApi(async () => {
        let res = {
          message: ""
        };
        if (authStore.staff?.id === staff?.id) {
          res = await staffServices.editMyProfile(data);
        } else {
          res = await staffServices.editStaffInfo(staff?.id, data);
        }

        if (res?.success) {
          // await authStore.loadStaffInfo();
          return { ...res };
        }
        // setExpertisesList([]);
        // setIsFetchConfigSuccess(true);
        return { ...res };
      });
    }
  };

  const handleAfterEditStaffRole = async () => {
    await loadData();
  };

  const handleAfterBlockStaff = async () => {
    await loadData();
  };

  const handleAfterUnblockStaff = async () => {
    await loadData();
  };

  const handleAfterChangeAvatar = async () => {
    await loadData();
  };

  // console.log("staff: ", staff);
  // console.log("watch(): ", watch());

  return (
    <>
      {staff && (
        <PersonDetailWrapper
          person={staff}
          canUpdate={canUpdateStaff}
          handleReset={() => {
            reset(defaultValues);
          }}
          handleSave={handleSubmit(handleSaveDetail)}
          changeAvatarModal={changeAvatarModal}
        >
          <CustomOverlay open={isLoading} />
          <SectionContent title={t("title.identify")}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <CustomInput
                  disabled={!canUpdateStaff || staff?.emailVerified}
                  showCanEditIcon
                  control={control}
                  rules={{
                    required: tInputValidation("required"),
                    pattern: {
                      value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                      message: tInputValidation("format")
                    },
                    maxLength: {
                      value: staffInputValidate.EMAIL_MAX_LENGTH,
                      message: tInputValidation("maxLength", {
                        maxLength: staffInputValidate.EMAIL_MAX_LENGTH
                      })
                    }
                  }}
                  label={tStaff("email")}
                  trigger={trigger}
                  name="email"
                  type="email"
                  message={
                    staff?.emailVerified && staff?.email === watch().email
                      ? {
                          type: "success",
                          text: tStaffMessage("emailVerifiedSuccess")
                        }
                      : {
                          type: "error",
                          text: tStaffMessage("emailVerifiedFailed")
                        }
                  }
                  InputProps={
                    staff?.emailVerified
                      ? {}
                      : {
                          endAdornment: authStore.staff?.id === staff?.id && (
                            <InputAdornment position="end">
                              <Button
                                variant="contained"
                                sx={{
                                  bgcolor: theme.palette.warning.light,
                                  color: theme.palette.warning.contrastText
                                }}
                                onClick={() => {
                                  navigate(routeConfig.verification, {
                                    state: { phoneNumberOrEmail: staff?.email, isFinishSendInfoStep: false }
                                  });
                                }}
                              >
                                {t("button.verify")}
                              </Button>
                            </InputAdornment>
                          )
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
                    required: tInputValidation("required"),
                    maxLength: {
                      value: staffInputValidate.USERNAME_MAX_LENGTH,
                      message: tInputValidation("maxLength", {
                        maxLength: staffInputValidate.USERNAME_MAX_LENGTH
                      })
                    }
                  }}
                  label={tStaff("username")}
                  trigger={trigger}
                  name="username"
                  type="text"
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <CustomInput
                  disabled={!canUpdateStaff || staff?.phoneVerified}
                  showCanEditIcon
                  control={control}
                  rules={{
                    required: tInputValidation("required"),
                    pattern: {
                      value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
                      message: tInputValidation("format")
                    }
                  }}
                  label={tStaff("phoneNumber")}
                  trigger={trigger}
                  name="phoneNumber"
                  type="phone"
                  message={
                    staff?.phoneVerified && staff?.phoneNumber === watch().phoneNumber
                      ? {
                          type: "success",
                          text: tStaffMessage("phoneVerifiedSuccess")
                        }
                      : {
                          type: "error",
                          text: tStaffMessage("phoneVerifiedFailed")
                        }
                  }
                  InputProps={
                    authStore.staff?.id === staff?.id && staff?.phoneVerified
                      ? {}
                      : {
                          endAdornment: authStore.staff?.id === staff?.id && (
                            <InputAdornment position="end">
                              <Button
                                variant="contained"
                                sx={{
                                  bgcolor: theme.palette.warning.light,
                                  color: theme.palette.warning.contrastText
                                }}
                                onClick={() => {
                                  navigate(routeConfig.verification, {
                                    state: { phoneNumberOrEmail: staff?.phoneNumber, isFinishSendInfoStep: false }
                                  });
                                }}
                              >
                                {t("button.verify")}
                              </Button>
                            </InputAdornment>
                          )
                        }
                  }
                />
              </Grid>
            </Grid>
          </SectionContent>

          <SectionContent title={t("title.account")}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <CustomInput
                  disabled
                  showCanEditIcon
                  control={control}
                  label={tStaff("role")}
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
                  label={tStaff("status")}
                  trigger={trigger}
                  name="status"
                  type="text"
                  InputProps={
                    canBlockStaff && {
                      endAdornment: (
                        <InputAdornment position="end">
                          {staff?.blocked ? (
                            <FontAwesomeIcon
                              size="1x"
                              icon={faGearIcon}
                              onClick={() => {
                                unblockStaffModal.setShow(true);
                                unblockStaffModal.setData(staff);
                              }}
                              cursor="pointer"
                              color={theme.palette.error.light}
                            />
                          ) : (
                            <FontAwesomeIcon
                              size="1x"
                              icon={faGearIcon}
                              onClick={() => {
                                blockStaffModal.setShow(true);
                                blockStaffModal.setData(staff);
                              }}
                              cursor="pointer"
                              color={theme.palette.success.light}
                            />
                          )}
                        </InputAdornment>
                      )
                    }
                  }
                />
              </Grid>
            </Grid>
          </SectionContent>

          <SectionContent title={t("title.personality")}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12} md={12} lg={6}>
                <CustomInput
                  disabled={!canUpdateStaff}
                  showCanEditIcon
                  control={control}
                  rules={{
                    required: tInputValidation("required"),
                    maxLength: {
                      value: staffInputValidate.NAME_MAX_LENGTH,
                      message: tInputValidation("maxLength", {
                        maxLength: staffInputValidate.NAME_MAX_LENGTH
                      })
                    }
                  }}
                  label={tStaff("name")}
                  trigger={trigger}
                  name="name"
                  type="text"
                />
              </Grid>

              <Grid item xs={12} sm={12} md={12} lg={6}>
                <CustomInput
                  disabled={!canUpdateStaff}
                  showCanEditIcon
                  control={control}
                  rules={{
                    maxLength: {
                      value: staffInputValidate.HEALTH_INSURANCE_MAX_LENGTH,
                      message: tInputValidation("maxLength", {
                        maxLength: staffInputValidate.HEALTH_INSURANCE_MAX_LENGTH
                      })
                    }
                  }}
                  label={tStaff("healthInsurance")}
                  trigger={trigger}
                  name="healthInsurance"
                  type="text"
                />
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={6}>
                <CustomInput
                  disabled={!canUpdateStaff}
                  showCanEditIcon
                  control={control}
                  rules={{
                    required: tInputValidation("required")
                  }}
                  label={tStaff("dob")}
                  trigger={trigger}
                  name="dob"
                  type="date"
                />
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={6}>
                <CustomInput
                  disabled={!canUpdateStaff}
                  showCanEditIcon
                  control={control}
                  rules={{
                    required: tInputValidation("required"),
                    maxLength: {
                      value: staffInputValidate.GENDER_MAX_LENGTH,
                      message: tInputValidation("maxLength", {
                        maxLength: staffInputValidate.GENDER_MAX_LENGTH
                      })
                    }
                  }}
                  label={tStaff("gender")}
                  trigger={trigger}
                  name="gender"
                  childrenType="select"
                >
                  <Select
                    renderValue={(selected) => {
                      return tStaffGender(staffGendersListObj[selected]?.label);
                    }}
                  >
                    {staffGendersList.map((item) => {
                      return (
                        <MenuItem key={item?.value} value={item?.value}>
                          <ListItemText primary={tStaffGender(item?.label)} />
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
                      value: staffInputValidate.ADDRESS_MAX_LENGTH,
                      message: tInputValidation("maxLength", {
                        maxLength: staffInputValidate.ADDRESS_MAX_LENGTH
                      })
                    }
                  }}
                  label={tStaff("address")}
                  trigger={trigger}
                  name="address"
                  type="text"
                  multiline
                  rows={6}
                />
              </Grid>
            </Grid>
          </SectionContent>
          {staff?.role === staffRoles.ROLE_DOCTOR && (
            <SectionContent title={t("title.doctor")}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <CustomInput
                    disabled={!canUpdateStaff}
                    showCanEditIcon
                    control={control}
                    rules={{
                      maxLength: {
                        value: staffInputValidate.EDUCATION_MAX_LENGTH,
                        message: tInputValidation("maxLength", {
                          maxLength: staffInputValidate.EDUCATION_MAX_LENGTH
                        })
                      }
                    }}
                    label={tStaff("education")}
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
                        value: staffInputValidate.CERTIFICATE_MAX_LENGTH,
                        message: tInputValidation("maxLength", {
                          maxLength: staffInputValidate.CERTIFICATE_MAX_LENGTH
                        })
                      }
                    }}
                    label={tStaff("certificate")}
                    trigger={trigger}
                    name="certificate"
                    type="text"
                    multiline
                    rows={2}
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <CustomInput
                    disabled={!canUpdateStaff}
                    showCanEditIcon
                    control={control}
                    rules={{
                      maxLength: {
                        value: staffInputValidate.DESCRIPTION_MAX_LENGTH,
                        message: tInputValidation("maxLength", {
                          maxLength: staffInputValidate.DESCRIPTION_MAX_LENGTH
                        })
                      }
                    }}
                    label={tStaff("description")}
                    trigger={trigger}
                    name="description"
                    type="text"
                    multiline
                    rows={6}
                  />
                </Grid>
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
                    disabled={!canUpdateStaff || !canUpdateStaffExpertise}
                    showCanEditIcon
                    control={control}
                    rules={{}}
                    label={tStaff("expertises")}
                    trigger={trigger}
                    name="expertises"
                    childrenType="select"
                  >
                    <Select
                      multiple
                      renderValue={(selected) => {
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
                </Grid>
              </Grid>
            </SectionContent>
          )}
        </PersonDetailWrapper>
      )}
      {editStaffRoleModal.show && (
        <EditStaffRoleModal
          show={editStaffRoleModal.show}
          setShow={editStaffRoleModal.setShow}
          data={editStaffRoleModal.data}
          setData={editStaffRoleModal.setData}
          handleAfterEditStaffRole={handleAfterEditStaffRole}
        />
      )}

      {blockStaffModal.show && (
        <BlockStaffModal
          show={blockStaffModal.show}
          setShow={blockStaffModal.setShow}
          data={blockStaffModal.data}
          setData={blockStaffModal.setData}
          handleAfterBlockStaff={handleAfterBlockStaff}
        />
      )}

      {unblockStaffModal.show && (
        <UnblockStaffModal
          show={unblockStaffModal.show}
          setShow={unblockStaffModal.setShow}
          data={unblockStaffModal.data}
          setData={unblockStaffModal.setData}
          handleAfterUnblockStaff={handleAfterUnblockStaff}
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
          handleAfterChangeAvatar={handleAfterChangeAvatar}
        />
      )}
    </>
  );
}

StaffDetail.propTypes = {
  staff: PropTypes.object.isRequired,
  loadData: PropTypes.func.isRequired,
  expertisesList: PropTypes.array.isRequired
};

export default WithExpertisesLoaderWrapper(StaffDetail);
