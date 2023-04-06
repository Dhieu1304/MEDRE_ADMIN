import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import CustomModal from "../../../components/CustomModal";

function EditStaffStatusModal({ show, setShow, data, setData, handleEditStaffRolee }) {
  const { handleSubmit } = useForm({
    mode: "onChange",
    defaultValues: {
      expertise: ""
    },
    criteriaMode: "all"
  });

  const { t } = useTranslation("staffFeature", { keyPrefix: "add_expertise_modal" });

  return (
    <CustomModal
      show={show}
      setShow={setShow}
      data={data}
      setData={setData}
      title={t("title")}
      submitBtnLabel={t("btn_label")}
      onSubmit={handleSubmit(handleEditStaffRolee)}
    >
      {/* <CustomStaffInput control={control} rules={{}} label={t("expertise")} trigger={trigger} name="expertise" type="text" /> */}
    </CustomModal>
  );
}

EditStaffStatusModal.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  setData: PropTypes.func.isRequired,
  handleEditStaffRolee: PropTypes.func.isRequired
};

export default EditStaffStatusModal;
