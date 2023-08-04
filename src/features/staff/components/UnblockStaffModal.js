import { Box, Typography, useTheme } from "@mui/material";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import CustomModal from "../../../components/CustomModal";
import { useFetchingStore } from "../../../store/FetchingApiStore";
import staffServices from "../../../services/staffServices";
import CustomInput from "../../../components/CustomInput/CustomInput";

function UnblockStaffModal({ show, setShow, data, setData, handleAfterUnblockStaff }) {
  const { control, trigger, handleSubmit } = useForm({
    mode: "onChange",
    defaultValues: {
      reason: ""
    },
    criteriaMode: "all"
  });

  const { t } = useTranslation("staffFeature", { keyPrefix: "UnblockStaffModal" });
  const theme = useTheme();

  const { fetchApi, fetchApiError } = useFetchingStore();

  const handleUnblockStaffStatus = async ({ reason }) => {
    await fetchApi(async () => {
      const res = await staffServices.unblockStaff(data?.id, reason);

      if (res?.success) {
        setShow(false);
        setData({});
        if (handleAfterUnblockStaff) await handleAfterUnblockStaff();
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
      submitBtnLabel={t("button.unblock")}
      onSubmit={handleSubmit(handleUnblockStaffStatus)}
    >
      <Box
        sx={{
          width: "100%"
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            {t("confirmQuestion", {
              name: data?.name
            })}
          </Typography>
          <CustomInput
            control={control}
            rules={{}}
            label={t("form.reason")}
            trigger={trigger}
            name="reason"
            type="text"
            multiline
            rows={5}
          />
        </Box>
        {fetchApiError && <Typography sx={{ color: theme.palette.error.light }}>{fetchApiError}</Typography>}
      </Box>
    </CustomModal>
  );
}

UnblockStaffModal.defaultProps = {
  handleAfterUnblockStaff: undefined
};

UnblockStaffModal.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  setData: PropTypes.func.isRequired,
  handleAfterUnblockStaff: PropTypes.func
};

export default UnblockStaffModal;
