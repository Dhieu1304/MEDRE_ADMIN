import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import CustomModal from "../../../components/CustomModal";
import User from "../../../entities/User/User";
import { useFetchingStore } from "../../../store/FetchingApiStore";
// import userServices from "../../../services/userServices";
import CustomInput from "../../../components/CustomInput/CustomInput";

function BlockUserModal({ show, setShow, data, setData, handleAfterBlockUser }) {
  const { control, trigger, handleSubmit } = useForm({
    mode: "onChange",
    defaultValues: {
      reason: ""
    },
    criteriaMode: "all"
  });

  const { t } = useTranslation("userFeature", { keyPrefix: "BlockUserModal" });

  const { fetchApi } = useFetchingStore();

  const handleBlockUserStatus = async ({ reason }) => {
    await fetchApi(async () => {
      // const res = await userServices.blockUser(data?.id, reason);
      const res = { reason };

      if (res?.success) {
        setShow(false);
        setData({});
        if (handleAfterBlockUser) await handleAfterBlockUser();
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
      submitBtnLabel={t("button.block")}
      onSubmit={handleSubmit(handleBlockUserStatus)}
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
          label={t("reason")}
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

BlockUserModal.defaultProps = {
  handleAfterBlockUser: undefined
};

BlockUserModal.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  data: PropTypes.instanceOf(User).isRequired,
  setData: PropTypes.func.isRequired,
  handleAfterBlockUser: PropTypes.func
};

export default BlockUserModal;