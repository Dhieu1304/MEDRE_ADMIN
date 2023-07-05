import PropTypes from "prop-types";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Box, FormControlLabel, Grid, Radio, RadioGroup } from "@mui/material";
import CustomModal from "../../../components/CustomModal";

import { useFetchingStore } from "../../../store/FetchingApiStore";
import staffServices from "../../../services/staffServices";
import { useStaffRolesContantToEditRoleTranslation } from "../hooks/useStaffConstantsTranslation";

function EditStaffRoleModal({ show, setShow, data, setData, handleAfterEditStaffRole }) {
  const { handleSubmit, control, trigger } = useForm({
    mode: "onChange",
    defaultValues: {
      role: data?.role || ""
    },
    criteriaMode: "all"
  });

  const { t } = useTranslation("staffFeature", { keyPrefix: "EditStaffRoleModal" });

  const [staffRoleContantList] = useStaffRolesContantToEditRoleTranslation();

  const { fetchApi } = useFetchingStore();

  const handleEditStaffRole = async ({ role }) => {
    await fetchApi(async () => {
      const res = await staffServices.editStaffRole(data?.id, { role });

      if (res?.success) {
        setShow(false);
        setData({});
        if (handleAfterEditStaffRole) await handleAfterEditStaffRole();
        return { ...res };
      }
      return { ...res };
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
      width={600}
    >
      <Box sx={{ width: "100%", px: 10 }}>
        <RadioGroup sx={{ witdh: "100%" }}>
          <Grid container spacing={2}>
            {staffRoleContantList.map((role) => {
              return (
                <Grid item lg={4} xs={12} key={role.value}>
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
      </Box>
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
