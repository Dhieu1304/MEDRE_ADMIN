import PropTypes from "prop-types";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { FormControlLabel, Grid, Radio, RadioGroup } from "@mui/material";
import { toast } from "react-toastify";
import CustomModal from "../../../components/CustomModal";

import Staff from "../../../entities/Staff/Staff";
import { staffRoles } from "../../../entities/Staff";
import { useFetchingStore } from "../../../store/FetchingApiStore";
import staffServices from "../../../services/staffServices";

function EditStaffRoleModal({ show, setShow, data, setData, handleAfterEditStaffRole }) {
  const { handleSubmit, control, trigger } = useForm({
    mode: "onChange",
    defaultValues: {
      role: data?.role || ""
    },
    criteriaMode: "all"
  });

  const { t } = useTranslation("staffFeature", { keyPrefix: "edit_staff_role_modal" });
  const { t: tRole } = useTranslation("staffFeature", { keyPrefix: "role" });

  const { fetchApi } = useFetchingStore();

  const roleList = useMemo(
    () => [
      {
        label: "admin",
        value: staffRoles.ROLE_ADMIN
      },
      {
        label: "doctor",
        value: staffRoles.ROLE_DOCTOR
      },
      {
        label: "nurse",
        value: staffRoles.ROLE_NURSE
      },
      {
        label: "customer_service",
        value: staffRoles.ROLE_CUSTOMER_SERVICE
      }
    ],
    []
  );

  const handleEditStaffRole = async ({ role }) => {
    await fetchApi(async () => {
      const res = await staffServices.editStaffRole({ role });

      if (res?.success) {
        setShow(false);
        setData({});
        if (handleAfterEditStaffRole) await handleAfterEditStaffRole();
        return { success: true };
      }
      toast(res.message);
      return { error: res.message };
    });
  };

  return (
    <CustomModal
      show={show}
      setShow={setShow}
      data={data}
      setData={setData}
      title={t("title")}
      submitBtnLabel={t("btn_label")}
      onSubmit={handleSubmit(handleEditStaffRole)}
    >
      <RadioGroup>
        <Grid container spacing={2}>
          {roleList.map((role) => {
            return (
              <Grid item xl={6} lg={6} md={6} sm={12} key={role.value}>
                <Controller
                  control={control}
                  trigger={trigger}
                  name="role"
                  render={({ field: { onChange, value } }) => {
                    const checked = role.value === value;
                    return (
                      <FormControlLabel
                        control={
                          <Radio
                            onChange={(e) => {
                              onChange(e.target.value);
                            }}
                          />
                        }
                        checked={checked}
                        value={role.value}
                        label={tRole(role.label)}
                      />
                    );
                  }}
                />
              </Grid>
            );
          })}
        </Grid>
      </RadioGroup>
    </CustomModal>
  );
}

EditStaffRoleModal.defaultProps = {
  handleAfterEditStaffRole: undefined
};

EditStaffRoleModal.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  data: PropTypes.instanceOf(Staff).isRequired,
  setData: PropTypes.func.isRequired,
  handleAfterEditStaffRole: PropTypes.func
};

export default EditStaffRoleModal;
