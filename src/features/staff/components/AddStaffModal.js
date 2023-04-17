import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Checkbox, Grid, ListItemText, MenuItem, Select } from "@mui/material";
import { useMemo } from "react";
import CustomModal from "../../../components/CustomModal";
import CustomInput from "../../../components/CustomInput";
// import { useFetchingStore } from "../../../store/FetchingApiStore";
import { staffInputValidate, staffRoles } from "../../../entities/Staff";
import { useAppConfigStore } from "../../../store/AppConfigStore";

function AddStaffModal({ show, setShow }) {
  const { control, trigger, watch, handleSubmit } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      username: "",
      phoneNumber: "",
      name: "",
      role: ""
    },
    criteriaMode: "all"
  });

  const { t } = useTranslation("staffFeature", { keyPrefix: "AddStaffModal" });
  const { t: tStaff } = useTranslation("staffEntity", { keyPrefix: "properties" });
  const { t: tStaffRole } = useTranslation("staffEntity", { keyPrefix: "constants.roles" });
  const { t: tInputValidation } = useTranslation("input", { keyPrefix: "validation" });

  // const { fetchApi } = useFetchingStore();

  const { locale } = useAppConfigStore();

  const staffRoleListObj = useMemo(() => {
    const staffRoleList = [
      {
        label: tStaffRole("admin"),
        value: staffRoles.ROLE_ADMIN
      },
      {
        label: tStaffRole("doctor"),
        value: staffRoles.ROLE_DOCTOR
      },
      {
        label: tStaffRole("nurse"),
        value: staffRoles.ROLE_NURSE
      },
      {
        label: tStaffRole("customerService"),
        value: staffRoles.ROLE_CUSTOMER_SERVICE
      }
    ];

    return staffRoleList.reduce((obj, cur) => {
      return {
        ...obj,
        [cur?.value]: cur
      };
    }, {});
  }, [locale]);

  const handleAddStaff = async () => {
    // const handleAddStaff = async ({ email, username, phoneNumber, name, role }) => {
    // await fetchApi(async () => {
    //   const res = await staffServices.c(expertise);
    //   if (res.success) {
    //     setShow(false);
    //     return { success: true };
    //   }
    //   toast(res.message);
    //   return { error: res.message };
    // });
  };

  return (
    <CustomModal
      show={show}
      setShow={setShow}
      title={t("title")}
      submitBtnLabel={t("button.add")}
      onSubmit={handleSubmit(handleAddStaff)}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <CustomInput
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
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <CustomInput
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
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <CustomInput
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
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <CustomInput
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

        <Grid item xs={12} sm={12} md={6} lg={6}>
          <CustomInput
            control={control}
            rules={{
              required: tInputValidation("required")
            }}
            label={tStaff("role")}
            trigger={trigger}
            name="role"
          >
            <Select
              renderValue={(selected) => {
                return staffRoleListObj[selected].label;
              }}
            >
              {Object.keys(staffRoleListObj).map((key) => {
                const item = staffRoleListObj[key];
                return (
                  <MenuItem key={item?.value} value={item?.value}>
                    <Checkbox checked={watch().role === item?.value} />
                    <ListItemText primary={item?.label} />
                  </MenuItem>
                );
              })}
            </Select>
          </CustomInput>
        </Grid>
      </Grid>
    </CustomModal>
  );
}

AddStaffModal.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired
};

export default AddStaffModal;
