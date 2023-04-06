import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import CustomModal from "../../../components/CustomModal/CustomModal";

function NotHaveAccessModal({ show, setShow, data, setData }) {
  const { t } = useTranslation("authFeature", { keyPrefix: "no_have_access_modal" });
  return (
    <CustomModal show={show} setShow={setShow} data={data} setData={setData} title={t("title")}>
      Bạn ko có quyền truy cạp
    </CustomModal>
  );
}

NotHaveAccessModal.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  setData: PropTypes.func.isRequired
};

export default NotHaveAccessModal;
