import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import CustomModal from "../../../components/CustomModal";
import Staff from "../../../entities/Staff/Staff";
import { useFetchingStore } from "../../../store/FetchingApiStore";
import staffServices from "../../../services/staffServices";
import CustomInput from "../../../components/CustomInput/CustomInput";

function BlockStaffModal({ show, setShow, data, setData, handleAfterBlockStaff }) {
  const { control, trigger, handleSubmit } = useForm({
    mode: "onChange",
    defaultValues: {
      reason: ""
    },
    criteriaMode: "all"
  });

  const { t } = useTranslation("staffFeature", { keyPrefix: "BlockStaffModal" });

  const { fetchApi } = useFetchingStore();

  const handleBlockStaffStatus = async ({ reason }) => {
    await fetchApi(async () => {
      const res = await staffServices.blockStaff(data?.id, reason);

      if (res?.success) {
        setShow(false);
        setData({});
        if (handleAfterBlockStaff) await handleAfterBlockStaff();
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
      submitBtnLabel={t("button.block")}
      onSubmit={handleSubmit(handleBlockStaffStatus)}
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
    </CustomModal>
  );
}

BlockStaffModal.defaultProps = {
  handleAfterBlockStaff: undefined
};

BlockStaffModal.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  data: PropTypes.instanceOf(Staff).isRequired,
  setData: PropTypes.func.isRequired,
  handleAfterBlockStaff: PropTypes.func
};

export default BlockStaffModal;
