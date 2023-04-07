import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import CustomModal from "../../../components/CustomModal";
import CustomStaffInput from "./CustomStaffInput";
import { useFetchingStore } from "../../../store/FetchingApiStore";
import staffServices from "../../../services/staffServices";

function AddExpertiseModal({ show, setShow, handleAfterAddExpertise }) {
  const { control, trigger, handleSubmit } = useForm({
    mode: "onChange",
    defaultValues: {
      expertise: ""
    },
    criteriaMode: "all"
  });

  const { t } = useTranslation("staffFeature", { keyPrefix: "add_expertise_modal" });

  const { fetchApi } = useFetchingStore();

  const handleAddExpertise = async ({ expertise }) => {
    await fetchApi(async () => {
      const res = await staffServices.createExpertise(expertise);

      if (res.success) {
        setShow(false);
        if (handleAfterAddExpertise) await handleAfterAddExpertise();
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
      title={t("title")}
      submitBtnLabel={t("btn_label")}
      onSubmit={handleSubmit(handleAddExpertise)}
    >
      <CustomStaffInput
        control={control}
        rules={{
          required: t("input_validation.required")
        }}
        label={t("expertise")}
        trigger={trigger}
        name="expertise"
        type="text"
      />
    </CustomModal>
  );
}

AddExpertiseModal.defaultProps = {
  handleAfterAddExpertise: undefined
};

AddExpertiseModal.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  handleAfterAddExpertise: PropTypes.func
};

export default AddExpertiseModal;
