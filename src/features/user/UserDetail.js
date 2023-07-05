import React, { useEffect, useMemo, useState } from "react";

import { Grid, Select, MenuItem, ListItemText, InputAdornment, useTheme } from "@mui/material";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useAbility } from "@casl/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear as faGearIcon } from "@fortawesome/free-solid-svg-icons";
import CustomInput from "../../components/CustomInput";

import userServices from "../../services/userServices";
import { useFetchingStore } from "../../store/FetchingApiStore/hooks";
import CustomOverlay from "../../components/CustomOverlay";
import { useCustomModal } from "../../components/CustomModal";
import { userActionAbility, userInputValidate, userStatuses } from "../../entities/User";
import { AbilityContext } from "../../store/AbilityStore";
import { NotHaveAccessModal } from "../auth";
import { mergeObjectsWithoutNullAndUndefined } from "../../utils/objectUtil";
import { BlockUserModal, UnblockUserModal } from "./components";
import { useUserGendersContantTranslation } from "./hooks/useUserConstantsTranslation";
import SectionContent from "../../components/SectionContent";
import PersonDetailWrapper from "../../components/PersonDetailWrapper/PersonDetailWrapper";
import entities from "../../entities/entities";

function UserDetail() {
  const [user, setUser] = useState();

  const { t } = useTranslation("userFeature", { keyPrefix: "UserDetail" });

  const { t: tUser } = useTranslation("userEntity", { keyPrefix: "properties" });
  const { t: tUserMessage } = useTranslation("userEntity", { keyPrefix: "messages" });
  const { t: tInputValidation } = useTranslation("input", { keyPrefix: "validation" });

  const [defaultValues, setDefaultValues] = useState({
    phoneNumber: "",
    email: "",
    name: "",
    address: "",
    gender: "",
    status: "",
    dob: "",
    healthInsurance: ""
  });

  const theme = useTheme();

  const notHaveAccessModal = useCustomModal();
  const blockUserModal = useCustomModal();
  const unblockUserModal = useCustomModal();

  const params = useParams();
  const userId = useMemo(() => params?.userId, [params?.userId]);

  const { isLoading, fetchApi } = useFetchingStore();

  const [userGenderContantList, userGenderContantListObj] = useUserGendersContantTranslation();

  const { control, trigger, watch, reset, handleSubmit } = useForm({
    mode: "onChange",
    defaultValues,
    criteriaMode: "all"
  });

  const loadData = async () => {
    await fetchApi(
      async () => {
        const res = await userServices.getUserDetail(userId);

        if (res.success) {
          const userData = res.user;
          setUser({ ...userData });

          const newDefaultValues = {
            ...mergeObjectsWithoutNullAndUndefined(defaultValues, userData),
            status: userData?.blocked ? userStatuses.STATUS_BLOCK : userStatuses.STATUS_UNBLOCK
            // gender: ""
          };

          setDefaultValues(newDefaultValues);
          reset(newDefaultValues);

          return { ...res };
        }
        setUser({});
        return { ...res };
      },
      { hideSuccessToast: true }
    );
  };
  useEffect(() => {
    loadData();
  }, [userId]);

  const ability = useAbility(AbilityContext);

  const canUpdateUser = ability.can(userActionAbility.UPDATE, entities.USER);
  const canBlockUser = ability.can(userActionAbility.BLOCK, entities.USER);

  const handleSaveDetail = async ({
    phoneNumber,
    // email,
    name,
    address,
    gender,
    dob,
    healthInsurance
  }) => {
    const data = {
      phoneNumber,
      name,
      address,
      gender,
      dob,
      healthInsurance
    };

    if (canUpdateUser) {
      await fetchApi(async () => {
        const res = await userServices.editUserInfo(data);
        if (res?.success) {
          return { ...res };
        }

        return { ...res };
      });
    }
  };

  const handleAfterBlockUser = async () => {
    await loadData();
  };

  const handleAfterUnblockUser = async () => {
    await loadData();
  };

  return (
    <>
      {user && (
        <PersonDetailWrapper
          person={user}
          canUpdate={canUpdateUser}
          handleReset={() => {
            reset(defaultValues);
          }}
          handleSave={handleSubmit(handleSaveDetail)}
        >
          <CustomOverlay open={isLoading} />
          <SectionContent title={t("title.account")}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <CustomInput
                  disabled={!canUpdateUser}
                  showCanEditIcon
                  control={control}
                  rules={{
                    required: tInputValidation("required"),
                    pattern: {
                      value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                      message: tInputValidation("format")
                    },
                    maxLength: {
                      value: userInputValidate.EMAIL_MAX_LENGTH,
                      message: tInputValidation("maxLength", {
                        maxLength: userInputValidate.EMAIL_MAX_LENGTH
                      })
                    }
                  }}
                  label={tUser("email")}
                  trigger={trigger}
                  name="email"
                  type="email"
                  message={
                    user?.emailVerified && user?.email === watch().email
                      ? {
                          type: "success",
                          text: tUserMessage("emailVerifiedSuccess")
                        }
                      : {
                          type: "error",
                          text: tUserMessage("emailVerifiedFailed")
                        }
                  }
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <CustomInput
                  disabled={!canUpdateUser}
                  showCanEditIcon
                  control={control}
                  rules={{
                    required: tInputValidation("required"),
                    pattern: {
                      value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
                      message: tInputValidation("format")
                    }
                  }}
                  label={tUser("phoneNumber")}
                  trigger={trigger}
                  name="phoneNumber"
                  type="phone"
                  message={
                    user?.phoneVerified && user?.phoneNumber === watch().phoneNumber
                      ? {
                          type: "success",
                          text: tUserMessage("phoneVerifiedSuccess")
                        }
                      : {
                          type: "error",
                          text: tUserMessage("phoneVerifiedFailed")
                        }
                  }
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <CustomInput
                  disabled
                  showCanEditIcon
                  control={control}
                  label={tUser("status")}
                  trigger={trigger}
                  name="status"
                  type="text"
                  InputProps={
                    canBlockUser && {
                      endAdornment: (
                        <InputAdornment position="end">
                          {user.blocked ? (
                            <FontAwesomeIcon
                              size="1x"
                              icon={faGearIcon}
                              onClick={() => {
                                unblockUserModal.setShow(true);
                                unblockUserModal.setData(user);
                              }}
                              cursor="pointer"
                              color={theme.palette.error.light}
                            />
                          ) : (
                            <FontAwesomeIcon
                              size="1x"
                              icon={faGearIcon}
                              onClick={() => {
                                blockUserModal.setShow(true);
                                blockUserModal.setData(user);
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
                  disabled={!canUpdateUser}
                  showCanEditIcon
                  control={control}
                  rules={{
                    required: tInputValidation("required"),
                    maxLength: {
                      value: userInputValidate.NAME_MAX_LENGTH,
                      message: tInputValidation("maxLength", {
                        maxLength: userInputValidate.NAME_MAX_LENGTH
                      })
                    }
                  }}
                  label={tUser("name")}
                  trigger={trigger}
                  name="name"
                  type="text"
                />
              </Grid>

              <Grid item xs={12} sm={12} md={12} lg={6}>
                <CustomInput
                  disabled={!canUpdateUser}
                  showCanEditIcon
                  control={control}
                  rules={{
                    maxLength: {
                      value: userInputValidate.HEALTH_INSURANCE_MAX_LENGTH,
                      message: tInputValidation("maxLength", {
                        maxLength: userInputValidate.HEALTH_INSURANCE_MAX_LENGTH
                      })
                    }
                  }}
                  label={tUser("healthInsurance")}
                  trigger={trigger}
                  name="healthInsurance"
                  type="text"
                />
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={6}>
                <CustomInput
                  disabled={!canUpdateUser}
                  showCanEditIcon
                  control={control}
                  rules={{
                    required: tInputValidation("required")
                  }}
                  label={tUser("dob")}
                  trigger={trigger}
                  name="dob"
                  type="date"
                />
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={6}>
                <CustomInput
                  disabled={!canUpdateUser}
                  showCanEditIcon
                  control={control}
                  rules={{
                    required: tInputValidation("required"),
                    maxLength: {
                      value: userInputValidate.GENDER_MAX_LENGTH,
                      message: tInputValidation("maxLength", {
                        maxLength: userInputValidate.GENDER_MAX_LENGTH
                      })
                    }
                  }}
                  label={tUser("gender")}
                  trigger={trigger}
                  name="gender"
                  childrenType="select"
                >
                  <Select
                    renderValue={(selected) => {
                      return userGenderContantListObj[selected]?.label;
                    }}
                  >
                    {userGenderContantList.map((item) => {
                      return (
                        <MenuItem key={item?.value} value={item?.value}>
                          <ListItemText primary={item?.label} />
                        </MenuItem>
                      );
                    })}
                  </Select>
                </CustomInput>
              </Grid>

              <Grid item xs={12} sm={12} md={12} lg={12}>
                <CustomInput
                  disabled={!canUpdateUser}
                  showCanEditIcon
                  control={control}
                  rules={{
                    maxLength: {
                      value: userInputValidate.ADDRESS_MAX_LENGTH,
                      message: tInputValidation("maxLength", {
                        maxLength: userInputValidate.ADDRESS_MAX_LENGTH
                      })
                    }
                  }}
                  label={tUser("address")}
                  trigger={trigger}
                  name="address"
                  type="text"
                  multiline
                  rows={6}
                />
              </Grid>
            </Grid>
          </SectionContent>
        </PersonDetailWrapper>
      )}

      {blockUserModal.show && (
        <BlockUserModal
          show={blockUserModal.show}
          setShow={blockUserModal.setShow}
          data={blockUserModal.data}
          setData={blockUserModal.setData}
          handleAfterBlockUser={handleAfterBlockUser}
        />
      )}

      {unblockUserModal.show && (
        <UnblockUserModal
          show={unblockUserModal.show}
          setShow={unblockUserModal.setShow}
          data={unblockUserModal.data}
          setData={unblockUserModal.setData}
          handleAfterUnblockUser={handleAfterUnblockUser}
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
    </>
  );
}

export default UserDetail;
