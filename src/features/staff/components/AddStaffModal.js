import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Box, Checkbox, Grid, ListItemText, MenuItem, Select } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CustomModal from "../../../components/CustomModal";
import CustomInput from "../../../components/CustomInput";
import { staffInputValidate } from "../../../entities/Staff";
import { useStaffRolesContantTranslation } from "../hooks/useConstantsTranslation";
import { useFetchingStore } from "../../../store/FetchingApiStore";
import staffServices from "../../../services/staffServices";
import routeConfig from "../../../config/routeConfig";
import CustomOverlay from "../../../components/CustomOverlay/CustomOverlay";

function AddStaffModal({ show, setShow }) {
  const { control, trigger, watch, handleSubmit } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "ngocsang30032001@gmail.com",
      username: "sang",
      phoneNumber: "0934111222",
      name: "Trần Sang",
      role: "",
      password: "A@111111",
      confirmPassword: "A@111111"
    },
    criteriaMode: "all"
  });

  const { isLoading, fetchApi } = useFetchingStore();
  const navigate = useNavigate();

  const { t } = useTranslation("staffFeature", { keyPrefix: "AddStaffModal" });
  const { t: tStaff } = useTranslation("staffEntity", { keyPrefix: "properties" });
  const { t: tInputValidation } = useTranslation("input", { keyPrefix: "validation" });

  const [staffRoleContantList, staffRoleContantListObj] = useStaffRolesContantTranslation();

  const handleAddStaff = async ({ email, username, phoneNumber, name, role, password }) => {
    // console.log({ email, username, phoneNumber, name, role, password });
    // const handleAddStaff = async ({ email, username, phoneNumber, name, role }) => {
    await fetchApi(async () => {
      const res = await staffServices.createStaff({ email, username, phoneNumber, name, role, password });
      // console.log("res: ", res);

      if (res.success) {
        setShow(false);
        const staffId = res?.staff?.id;
        if (staffId) navigate(`${routeConfig.staff}/${staffId}`);

        return { success: true };
      }
      toast(res.message);
      return { error: res.message };
    });
  };

  return (
    <>
      <CustomOverlay open={isLoading} />
      <CustomModal
        show={show}
        setShow={setShow}
        title={t("title")}
        submitBtnLabel={t("button.add")}
        onSubmit={handleSubmit(handleAddStaff)}
      >
        <Box
          sx={{
            width: "100%",
            height: 400,
            overflow: "scroll",
            py: 2
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
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
            <Grid item xs={12}>
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
            <Grid item xs={12}>
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
            <Grid item xs={12}>
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

            <Grid item xs={12}>
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
                    return staffRoleContantListObj[selected].label;
                  }}
                >
                  {staffRoleContantList.map((role) => {
                    return (
                      <MenuItem key={role?.value} value={role?.value}>
                        <Checkbox checked={watch().role === role?.value} />
                        <ListItemText primary={role?.label} />
                      </MenuItem>
                    );
                  })}
                </Select>
              </CustomInput>
            </Grid>

            <Grid item xs={12}>
              <CustomInput
                control={control}
                rules={{
                  required: tInputValidation("required"),
                  minLength: {
                    value: staffInputValidate.PASSWORD_MIN_LENGTH,
                    message: tInputValidation("minLength", {
                      minLength: staffInputValidate.PASSWORD_MIN_LENGTH
                    })
                  },
                  maxLength: {
                    value: staffInputValidate.PASSWORD_MAX_LENGTH,
                    message: tInputValidation("maxLength", {
                      maxLength: staffInputValidate.PASSWORD_MAX_LENGTH
                    })
                  },
                  pattern: {
                    value: /(?=.*[a-zA-Z])(?=.*[0-9])/,
                    message: tInputValidation("passwordFormat")
                  }
                }}
                label={tStaff("password")}
                trigger={trigger}
                triggerTo="confirmPassword"
                name="password"
                type="password"
              />
            </Grid>

            <Grid item xs={12}>
              <CustomInput
                control={control}
                rules={{
                  required: tInputValidation("required"),
                  validate: (value) =>
                    value === watch("password") ||
                    tInputValidation("same", {
                      left: tStaff("confirmPassword"),
                      right: tStaff("password")
                    })
                }}
                label={tStaff("confirmPassword")}
                trigger={trigger}
                name="confirmPassword"
                type="password"
                isCustomError
              />
            </Grid>
          </Grid>
        </Box>
      </CustomModal>
    </>
  );
}

AddStaffModal.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired
};

export default AddStaffModal;
