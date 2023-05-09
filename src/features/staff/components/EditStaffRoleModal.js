import PropTypes from "prop-types";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormControlLabel, Grid, Radio, RadioGroup } from "@mui/material";
import { toast } from "react-toastify";
import CustomModal from "../../../components/CustomModal";

import { useFetchingStore } from "../../../store/FetchingApiStore";
import staffServices from "../../../services/staffServices";
import { useStaffRolesContantTranslation } from "../hooks/useStaffConstantsTranslation";

function EditStaffRoleModal({ show, setShow, data, setData, handleAfterEditStaffRole }) {
  const { handleSubmit, control, trigger } = useForm({
    mode: "onChange",
    defaultValues: {
      role: data?.role || ""
    },
    criteriaMode: "all"
  });

  const { t } = useTranslation("staffFeature", { keyPrefix: "EditStaffRoleModal" });

  const [staffRoleContantList] = useStaffRolesContantTranslation();

  const { fetchApi } = useFetchingStore();

  const handleEditStaffRole = async ({ role }) => {
    await fetchApi(async () => {
      const res = await staffServices.editStaffRole(data?.id, { role });

      if (res?.success) {
        setShow(false);
        setData({});
        if (handleAfterEditStaffRole) await handleAfterEditStaffRole();
        toast(res.message);
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
      submitBtnLabel={t("button.save")}
      onSubmit={handleSubmit(handleEditStaffRole)}
    >
      <RadioGroup>
        <Grid container spacing={2}>
          {staffRoleContantList.map((role) => {
            return (
              <Grid item lg={6} xs={12} key={role.value}>
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
                        value={role?.value}
                        label={role?.label}
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
  data: PropTypes.object.isRequired,
  setData: PropTypes.func.isRequired,
  handleAfterEditStaffRole: PropTypes.func
};

export default EditStaffRoleModal;
