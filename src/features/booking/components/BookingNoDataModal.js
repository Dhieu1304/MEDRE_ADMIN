import PropTypes from "prop-types";

import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import CustomModal from "../../../components/CustomModal/CustomModal";

function BookingNoDataModal({ show, setShow }) {
  const { t } = useTranslation("bookingFeature", { keyPrefix: "BookingNoDataModal" });

  return (
    <CustomModal show={show} setShow={setShow} title={t("title")}>
      <Box
        sx={{
          px: 1,
          py: 1,
          width: "100%",
          maxHeight: 200,
          overflow: "scroll"
        }}
      >
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          {t("noDataMessage")}
        </Typography>
      </Box>
    </CustomModal>
  );
}

BookingNoDataModal.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired
};

export default BookingNoDataModal;
