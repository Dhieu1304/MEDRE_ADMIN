import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Box, Typography } from "@mui/material";
import CustomModal from "../../../components/CustomModal";

import { useFetchingStore } from "../../../store/FetchingApiStore";
import timeOffServices from "../../../services/timeOffServices";
import WithTimesLoaderWrapper from "../hocs/WithTimesLoaderWrapper";

function DeleteNewTimeOffModal({ show, setShow, data, setData, handleAfterDeleteTimeOff }) {
  const { t } = useTranslation("scheduleFeature", { keyPrefix: "DeleteTimeOffModal" });

  const { fetchApi } = useFetchingStore();

  const handleDeleteTimeOff = async () => {
    // console.log({ data, date, session });
    await fetchApi(async () => {
      const id = data?.id;
      const res = await timeOffServices.deleteNewTimeOff(id);
      if (res?.success) {
        setShow(false);
        setData({});
        if (handleAfterDeleteTimeOff) await handleAfterDeleteTimeOff();
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
      submitBtnLabel={t("button.save")}
      onSubmit={handleDeleteTimeOff}
    >
      <Box>
        <Typography>{t("question")}</Typography>
      </Box>
    </CustomModal>
  );
}

DeleteNewTimeOffModal.defaultProps = {
  handleAfterDeleteTimeOff: undefined
};

DeleteNewTimeOffModal.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  setData: PropTypes.func.isRequired,
  handleAfterDeleteTimeOff: PropTypes.func
};

export default WithTimesLoaderWrapper(DeleteNewTimeOffModal);
