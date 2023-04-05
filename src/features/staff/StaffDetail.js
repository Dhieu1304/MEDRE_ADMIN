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
  IconButton
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Add as AddIcon } from "@mui/icons-material";
import { toast } from "react-toastify";
import CustomStaffInput from "./components/CustomStaffInput";
import staffServices from "../../services/staffServices";
import { useFetchingStore } from "../../store/FetchingApiStore/hooks";
import CustomOverlay from "../../components/CustomOverlay";
import ChangeAvatarModal from "./components/ChangeAvatarModal";
import { useCustomModal } from "../../components/CustomModal";
import AddExpertiseModal from "./components/AddExpertiseModal";
import { staffRoutes } from "../../pages/StaffPage";
import routeConfig from "../../config/routeConfig";
import {
  STAFF_ADDRESS_MAX_LENGTH,
  STAFF_CERTIFICATE_MAX_LENGTH,
  STAFF_DESCRIPTION_MAX_LENGTH,
  STAFF_EDUCATION_MAX_LENGTH,
  STAFF_EMAIL_MAX_LENGTH,
  STAFF_GENDER_MAX_LENGTH,
  STAFF_NAME_MAX_LENGTH,
  STAFF_ROLE_MAX_LENGTH,
  STAFF_STATUS_MAX_LENGTH,
  STAFF_USERNAME_MAX_LENGTH
} from "../../entities/Staff";

function StaffDetail() {
  const [staff, setStaff] = useState();
  const [defaultValues, setDefaultValues] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    name: "",
    address: "",
    gender: "",
    dob: "",
    role: "",
    status: "",
    description: "",
    education: "",
    certificate: "",
    expertise: []
  });

  const changeAvatarModal = useCustomModal();
  const addExpertiseModal = useCustomModal();

  const params = useParams();
  const staffId = useMemo(() => params?.staffId, [params?.staffId]);

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

  useEffect(() => {
    const loadData = async () => {
      await fetchApi(async () => {
        const res = await staffServices.getStaffDetail(staffId);

        if (res.success) {
          const staffData = res.staff;
          setStaff(staffData);

          const newDefaultValues = {
            username: staffData?.username,
            email: staffData?.email,
            phoneNumber: staffData?.phoneNumber,
            name: staffData?.name,
            address: staffData?.address,
            gender: staffData?.gender,
            dob: staffData?.dob,
            role: staffData?.role,
            status: staffData?.status,
            description: staffData?.description,
            education: staffData?.education,
            certificate: staffData?.certificate,
            expertise: staffData?.idExpertiseExpertises?.map((item) => item?.id)
          };

          setDefaultValues(newDefaultValues);
          reset(newDefaultValues);

          // setValue(newDefaultValues);

          return { success: true };
        }
        setStaff({});
        return { error: res.message };
      });
    };
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

  const loadConfig = async () => {
    await loadExpertises();
  };

  useEffect(() => {
    loadConfig();
  }, []);

  // console.log("expertiseListObj: ", expertiseListObj);
  // console.log("expertisesList: ", expertisesList);

  const handleAddExpertise = async ({ expertise }) => {
    await fetchApi(async () => {
      const res = await staffServices.createExpertise(expertise);

      if (res.success) {
        // const expertisesData = res?.expertises;
        // setExpertisesList(expertisesData);
        // setIsFetchConfigSuccess(true);
        addExpertiseModal.setShow(false);
        addExpertiseModal.setData({});
        await loadExpertises();
        return { success: true };
      }
      // setExpertisesList([]);
      // setIsFetchConfigSuccess(true);
      toast(res.message);
      return { error: res.message };
    });
  };

  const handleSaveDetail = async (data) => {
    // console.log("data: ", data);
    await fetchApi(async () => {
      const res = await staffServices.editMyProfile(data);

      if (res.success) {
        return { success: true };
      }
      // setExpertisesList([]);
      // setIsFetchConfigSuccess(true);
      toast(res.message);
      return { error: res.message };
    });
  };

  return (
    isFetchConfigSuccess && (
      <>
        <Box
          sx={{
            border: "1px solid rgba(0,0,0,0.1)",
            borderRadius: 4,
            px: {
              lg: 12,
              md: 0
            },
            pt: 5,
            pb: 10
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
                <CustomStaffInput
                  control={control}
                  rules={{
                    required: t("input_validation.required"),
                    pattern: {
                      value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                      message: t("input_validation.format")
                    },
                    maxLength: {
                      value: STAFF_EMAIL_MAX_LENGTH,
                      message: t("input_validation.max_length", {
                        maxLength: STAFF_EMAIL_MAX_LENGTH
                      })
                    }
                  }}
                  label={t("email")}
                  trigger={trigger}
                  name="email"
                  type="email"
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <CustomStaffInput
                  control={control}
                  rules={{
                    required: t("input_validation.required"),
                    maxLength: {
                      value: STAFF_USERNAME_MAX_LENGTH,
                      message: t("input_validation.max_length", {
                        maxLength: STAFF_USERNAME_MAX_LENGTH
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
                <CustomStaffInput
                  control={control}
                  rules={{
                    required: t("input_validation.required"),
                    pattern: {
                      value: /^((\+84)|0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-4|6-9])[0-9]{7}$/,
                      message: t("input_validation.format")
                    }
                  }}
                  label={t("phone")}
                  trigger={trigger}
                  name="phoneNumber"
                  type="text"
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
                <CustomStaffInput
                  control={control}
                  rules={{
                    required: t("input_validation.required"),
                    maxLength: {
                      value: STAFF_ROLE_MAX_LENGTH,
                      message: t("input_validation.max_length", {
                        maxLength: STAFF_ROLE_MAX_LENGTH
                      })
                    }
                  }}
                  label={t("role")}
                  trigger={trigger}
                  name="role"
                  type="text"
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <CustomStaffInput
                  control={control}
                  rules={{
                    required: t("input_validation.required"),
                    maxLength: {
                      value: STAFF_STATUS_MAX_LENGTH,
                      message: t("input_validation.max_length", {
                        maxLength: STAFF_STATUS_MAX_LENGTH
                      })
                    }
                  }}
                  label={t("status")}
                  trigger={trigger}
                  name="status"
                  type="text"
                />
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ mb: 4 }}>
              {t("title.personality")}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <CustomStaffInput
                  control={control}
                  rules={{
                    required: t("input_validation.required"),
                    maxLength: {
                      value: STAFF_NAME_MAX_LENGTH,
                      message: t("input_validation.max_length", {
                        maxLength: STAFF_NAME_MAX_LENGTH
                      })
                    }
                  }}
                  label={t("name")}
                  trigger={trigger}
                  name="name"
                  type="text"
                />
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={6}>
                <CustomStaffInput
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

              <Grid item xs={12} sm={12} md={6} lg={6}>
                <CustomStaffInput
                  control={control}
                  rules={{
                    maxLength: {
                      value: STAFF_ADDRESS_MAX_LENGTH,
                      message: t("input_validation.max_length", {
                        maxLength: STAFF_ADDRESS_MAX_LENGTH
                      })
                    }
                  }}
                  label={t("address")}
                  trigger={trigger}
                  name="address"
                  type="text"
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <CustomStaffInput
                  control={control}
                  rules={{
                    required: t("input_validation.required"),
                    maxLength: {
                      value: STAFF_GENDER_MAX_LENGTH,
                      message: t("input_validation.max_length", {
                        maxLength: STAFF_GENDER_MAX_LENGTH
                      })
                    }
                  }}
                  label={t("gender")}
                  trigger={trigger}
                  name="gender"
                >
                  <Select>
                    {gendersList.map((item) => {
                      return (
                        <MenuItem key={item?.value} value={item?.value}>
                          <ListItemText primary={t(item?.label)} />
                        </MenuItem>
                      );
                    })}
                  </Select>
                </CustomStaffInput>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ mb: 4 }}>
              {t("title.doctor")}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <CustomStaffInput
                  control={control}
                  rules={{
                    maxLength: {
                      value: STAFF_DESCRIPTION_MAX_LENGTH,
                      message: t("input_validation.max_length", {
                        maxLength: STAFF_DESCRIPTION_MAX_LENGTH
                      })
                    }
                  }}
                  label={t("description")}
                  trigger={trigger}
                  name="description"
                  type="text"
                />
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={6}>
                <CustomStaffInput
                  control={control}
                  rules={{
                    maxLength: {
                      value: STAFF_EDUCATION_MAX_LENGTH,
                      message: t("input_validation.max_length", {
                        maxLength: STAFF_EDUCATION_MAX_LENGTH
                      })
                    }
                  }}
                  label={t("education")}
                  trigger={trigger}
                  name="education"
                  type="text"
                />
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={6}>
                <CustomStaffInput
                  control={control}
                  rules={{
                    maxLength: {
                      value: STAFF_CERTIFICATE_MAX_LENGTH,
                      message: t("input_validation.max_length", {
                        maxLength: STAFF_CERTIFICATE_MAX_LENGTH
                      })
                    }
                  }}
                  label={t("certificate")}
                  trigger={trigger}
                  name="certificate"
                  type="text"
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={6}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <CustomStaffInput
                  control={control}
                  rules={{
                    required: t("input_validation.required")
                  }}
                  label={t("expertise")}
                  trigger={trigger}
                  name="expertise"
                >
                  <Select
                    multiple
                    renderValue={(selected) => {
                      if (Array.isArray(selected))
                        return selected
                          ?.map((cur) => {
                            return expertiseListObj[cur]?.name;
                          })
                          ?.join(", ");
                      return selected;
                    }}
                  >
                    {expertisesList.map((item) => {
                      return (
                        <MenuItem key={item?.id} value={item?.id}>
                          <Checkbox checked={watch().expertise?.indexOf(item?.id) > -1} />
                          <ListItemText primary={item?.name} />
                        </MenuItem>
                      );
                    })}
                  </Select>
                </CustomStaffInput>
                <IconButton
                  onClick={() => {
                    addExpertiseModal.setShow(true);
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Box>

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
                mr: 2
              }}
            >
              {t("reset_btn")}
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate(`${routeConfig.staff}/${staffId}${staffRoutes.schedule}`, { relative: true })}
              sx={{
                mr: 2
              }}
            >
              {t("schedule_btn")}
            </Button>
            <Button variant="contained" onClick={handleSubmit(handleSaveDetail)}>
              {t("save_btn")}
            </Button>
          </Box>
        </Box>

        {changeAvatarModal.show && (
          <ChangeAvatarModal
            show={changeAvatarModal.show}
            setShow={changeAvatarModal.setShow}
            data={changeAvatarModal.data}
            setData={changeAvatarModal.setData}
          />
        )}

        {addExpertiseModal.show && (
          <AddExpertiseModal
            show={addExpertiseModal.show}
            setShow={addExpertiseModal.setShow}
            data={addExpertiseModal.data}
            setData={addExpertiseModal.setData}
            handleAddExpertise={handleAddExpertise}
          />
        )}
      </>
    )
  );
}
export default StaffDetail;
