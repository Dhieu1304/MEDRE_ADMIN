import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import CustomModal from "../../../components/CustomModal/CustomModal";

function NotHaveAccessModal({ show, setShow }) {
  const { t } = useTranslation("authFeature", { keyPrefix: "NotHaveAccessModal" });
  return (
    <CustomModal show={show} setShow={setShow} title={t("title")}>
      {t("errorMessage")}
    </CustomModal>
  );
}

NotHaveAccessModal.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired
};

export default NotHaveAccessModal;
