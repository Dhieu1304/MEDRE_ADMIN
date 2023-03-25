import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import CustomModal from "../../../components/CustomModal";
import CustomStaffInput from "./CustomStaffInput";

function AddExpertiseModal({ show, setShow, data, setData }) {
  const { control, trigger } = useForm({
    mode: "onChange",
    defaultValues: {
      expertise: ""
    },
    criteriaMode: "all"
  });

  const handleAddExpertise = async () => {};

  const { t } = useTranslation("staffFeature", { keyPrefix: "add_expertise_modal" });

  return (
    <CustomModal
      show={show}
      setShow={setShow}
      data={data}
      setData={setData}
      title={t("title")}
      submitBtnLabel={t("btn_label")}
      onSubmit={handleAddExpertise}
    >
      <CustomStaffInput control={control} rules={{}} label={t("expertise")} trigger={trigger} name="expertise" type="text" />
    </CustomModal>
  );
}

AddExpertiseModal.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  setData: PropTypes.func.isRequired
};

export default AddExpertiseModal;
