import { Typography, useTheme } from "@mui/material";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import CustomModal from "../../../components/CustomModal";

function BlockStaffModal({ show, setShow, data, setData }) {
  const theme = useTheme();
  const handleBlock = async () => {};

  const { t } = useTranslation("staffFeature", { keyPrefix: "block_modal" });

  return (
    <CustomModal
      show={show}
      setShow={setShow}
      data={data}
      setData={setData}
      title={t("title")}
      submitBtnLabel={t("btn_label")}
      onSubmit={handleBlock}
    >
      <Typography variant="h4" textAlign="center" color={theme.palette.error.main}>
        {t("question")} {data?.name}
      </Typography>
    </CustomModal>
  );
}

BlockStaffModal.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  setData: PropTypes.func.isRequired
};

export default BlockStaffModal;
