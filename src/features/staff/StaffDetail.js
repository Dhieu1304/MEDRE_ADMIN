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
import { useParams } from "react-router-dom";
import { Add as AddIcon } from "@mui/icons-material";
import CustomStaffInput from "./components/CustomStaffInput";
import staffServices from "../../services/staffServices";
import { useFetchingStore } from "../../store/FetchingApiStore/hooks";
import CustomOverlay from "../../components/CustomOverlay";
import ChangeAvatarModal from "./components/ChangeAvatarModal";
import { useCustomModal } from "../../components/CustomModal";
import AddExpertiseModal from "./components/AddExpertiseModal";

function StaffDetail() {
  const [staff, setStaff] = useState();
  const [defaultValues, setDefaultValues] = useState({
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

  const { control, trigger, watch, reset } = useForm({
    mode: "onChange",
    defaultValues,
    criteriaMode: "all"
  });

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

  const loadConfig = async () => {
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

  useEffect(() => {
    loadConfig();
  }, []);

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
                  rules={{}}
                  label={t("email")}
                  trigger={trigger}
                  name="email"
                  type="email"
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <CustomStaffInput
                  control={control}
                  rules={{}}
                  label={t("username")}
                  trigger={trigger}
                  name="username"
                  type="text"
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <CustomStaffInput
                  control={control}
                  rules={{}}
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
                <CustomStaffInput control={control} rules={{}} label={t("role")} trigger={trigger} name="role" type="text" />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <CustomStaffInput
                  control={control}
                  rules={{}}
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
                <CustomStaffInput control={control} rules={{}} label={t("name")} trigger={trigger} name="name" type="text" />
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={6}>
                <CustomStaffInput control={control} rules={{}} label={t("dob")} trigger={trigger} name="dob" type="date" />
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={6}>
                <CustomStaffInput
                  control={control}
                  rules={{}}
                  label={t("address")}
                  trigger={trigger}
                  name="address"
                  type="text"
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <CustomStaffInput
                  control={control}
                  rules={{}}
                  label={t("gender")}
                  trigger={trigger}
                  name="gender"
                  type="text"
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
                <CustomStaffInput
                  control={control}
                  rules={{}}
                  label={t("description")}
                  trigger={trigger}
                  name="description"
                  type="text"
                />
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={6}>
                <CustomStaffInput
                  control={control}
                  rules={{}}
                  label={t("education")}
                  trigger={trigger}
                  name="education"
                  type="text"
                />
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={6}>
                <CustomStaffInput
                  control={control}
                  rules={{}}
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
                <CustomStaffInput control={control} rules={{}} label={t("expertise")} trigger={trigger} name="expertise">
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
            <Button variant="contained">Save</Button>
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
          />
        )}
      </>
    )
  );
  //   return (
  //     <Grid container spacing={3}>
  //       <Grid item xs={12} sm={6}>
  //         <TextField label="Email" fullWidth />
  //         <TextField label="Phone Number" fullWidth />
  //         <TextField label="Username" fullWidth />
  //         <TextField label="Name" fullWidth />
  //       </Grid>
  //       <Grid item xs={12} sm={6}>
  //         <TextField label="Image" fullWidth />
  //         <TextField label="Address" fullWidth />
  //         <TextField label="Gender" fullWidth />
  //         <TextField label="Date of Birth" fullWidth />
  //       </Grid>
  //       <Grid item xs={12}>
  //         <TextField label="Role" fullWidth />
  //         <TextField label="Description" fullWidth />
  //         <TextField label="Education" fullWidth />
  //         <TextField label="Certificate" fullWidth />
  //         <TextField label="Status" fullWidth />
  //         <Button variant="contained">Save</Button>
  //       </Grid>
  //     </Grid>
  //   );
}
export default StaffDetail;
