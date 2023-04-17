import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

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

import { Add as AddIcon, RestartAlt as RestartAltIcon, Save as SaveIcon } from "@mui/icons-material";
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
import Staff, { staffActionAbility, staffGenders, staffInputValidate, staffStatus } from "../../entities/Staff";
import { AbilityContext } from "../../store/AbilityStore";
import { NotHaveAccessModal } from "../auth";
import { Expertise, expertiseActionAbility } from "../../entities/Expertise";
import EditStaffRoleModal from "./components/EditStaffRoleModal";
import { mergeObjectsWithoutNullAndUndefined } from "../../utils/objectUtil";
import { useAuthStore } from "../../store/AuthStore";
import { BlockStaffModal } from "./components";
import { WithExpertisesLoaderWrapper } from "./hocs";
import UnblockStaffModal from "./components/UnblockStaffModal";

function StaffDetail({ staffId, expertisesList, loadExpertisesList }) {
  const [staff, setStaff] = useState(new Staff());

  const { t } = useTranslation("staffFeature", { keyPrefix: "StaffDetail" });
  const { t: tBtn } = useTranslation("staffFeature", { keyPrefix: "StaffDetail.button" });

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

  const theme = useTheme();

  const changeAvatarModal = useCustomModal();
  const addExpertiseModal = useCustomModal();
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

  const { control, trigger, watch, reset, handleSubmit } = useForm({
    mode: "onChange",
    defaultValues,
    criteriaMode: "all"
  });

  const loadData = async () => {
    await fetchApi(async () => {
      const res = await staffServices.getStaffDetail(staffId);

      if (res.success) {
        const staffData = new Staff(res.staff);
        setStaff(staffData);

        const expertiseIds = staffData?.expertises?.map((expertise) => expertise?.id) || [];

        const newDefaultValues = {
          ...mergeObjectsWithoutNullAndUndefined(defaultValues, staffData),
          expertises: expertiseIds,
          status: staffData?.blocked ? staffStatus.STATUS_BLOCK : staffStatus.STATUS_UNBLOCK
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

  const ability = useAbility(AbilityContext);

  const canUpdateStaff = ability.can(staffActionAbility.UPDATE, staff);
  const canUpdateStaffRole = ability.can(staffActionAbility.UPDATE_ROLE, staff);
  const canBlockStaff = ability.can(staffActionAbility.BLOCK, staff);
  const canAddExpertise = ability.can(expertiseActionAbility.ADD, Expertise.magicWord());

  const handleSaveDetail = async ({
    // username,
    phoneNumber,
    // email,
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
      phoneNumber,
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
        if (authStore.staff?.id === staff.id) {
          res = await staffServices.editMyProfile(data);
        } else {
          res = await staffServices.editStaffInfo(data);
        }

        if (res?.success) {
          // await authStore.loadStaffInfo();
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
    await loadExpertisesList();
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

  return (
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
                disabled={!canUpdateStaff}
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
                        {staff.blocked ? (
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
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ mb: 4 }}>
            {t("title.personality")}
          </Typography>
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
                disabled={!canUpdateStaff}
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
              {tBtn("reset")}
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
              {tBtn("save")}
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
  );
}

StaffDetail.propTypes = {
  staffId: PropTypes.string.isRequired,
  expertisesList: PropTypes.array.isRequired,
  loadExpertisesList: PropTypes.func.isRequired
};

export default WithExpertisesLoaderWrapper(StaffDetail);
