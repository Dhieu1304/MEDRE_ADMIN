import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import CustomModal from "../../../components/CustomModal";
import Staff from "../../../entities/Staff/Staff";
import { useFetchingStore } from "../../../store/FetchingApiStore";
import { staffStatus } from "../../../entities/Staff/constant";
import staffServices from "../../../services/staffServices";

function EditStaffStatusModal({ show, setShow, data, setData, handleAfterEditStaffStatus }) {
  const { handleSubmit } = useForm({
    mode: "onChange",
    defaultValues: {
      status: data?.status || ""
    },
    criteriaMode: "all"
  });

  const { t } = useTranslation("staffFeature", { keyPrefix: "edit_staff_status_modal" });

  const { fetchApi } = useFetchingStore();

  const handleEditStaffStatus = async ({ status }) => {
    await fetchApi(async () => {
      const res = await staffServices.editStaffRole({ status });

      if (res?.success) {
        setShow(false);
        setData({});
        if (handleAfterEditStaffStatus) await handleAfterEditStaffStatus();
        return { success: true };
      }
      toast(res.message);
      return { error: res.message };
    });
  };

  const status = data?.status;

  return (
    <CustomModal
      show={show}
      setShow={setShow}
      data={data}
      setData={setData}
      title={t("title")}
      submitBtnLabel={status === staffStatus.STATUS_BLOCK ? t("unblock_btn_label") : t("block_btn_label")}
      onSubmit={handleSubmit(handleEditStaffStatus)}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Typography variant="h6">
          {t("confirm_question", {
            name: data?.name
          })}
        </Typography>
      </Box>
    </CustomModal>
  );
}

EditStaffStatusModal.defaultProps = {
  handleAfterEditStaffStatus: undefined
};

EditStaffStatusModal.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  data: PropTypes.instanceOf(Staff).isRequired,
  setData: PropTypes.func.isRequired,
  handleAfterEditStaffStatus: PropTypes.func
};

export default EditStaffStatusModal;
