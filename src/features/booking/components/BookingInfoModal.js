import { useEffect, useState } from "react";
import formatDate from "date-and-time";
import PropTypes from "prop-types";

import { useTranslation } from "react-i18next";
import { Box, Grid } from "@mui/material";
import CustomModal from "../../../components/CustomModal/CustomModal";
import { useFetchingStore } from "../../../store/FetchingApiStore";
import bookingServices from "../../../services/bookingServices";
import CustomInput from "../../../components/CustomInput/CustomInput";

function BookingInfoModal({ show, setShow, data, setData }) {
  const [booking, setBooking] = useState({});
  const { fetchApi } = useFetchingStore();
  const { t } = useTranslation("bookingFeature", {
    keyPrefix: "BookingModal"
  });

  const { t: tBooking } = useTranslation("bookingEntity", {
    keyPrefix: "properties"
  });

  const { t: tSchedule } = useTranslation("scheduleEntity", {
    keyPrefix: "properties"
  });

  const { t: tPatient } = useTranslation("patientEntity", {
    keyPrefix: "properties"
  });

  const handleToBookingDetail = () => {};

  // console.log({ data });

  useEffect(() => {
    const bookingId = data?.id;
    const loadData = async () => {
      await fetchApi(async () => {
        const res = await bookingServices.getBookingDetailById(bookingId);

        if (res.success) {
          const bookingData = res.booking;
          setBooking(bookingData);
          return { success: true, error: "" };
        }
        setBooking({});
        return { success: false, error: res.message };
      });
    };

    loadData();
  }, []);

  return (
    <CustomModal
      show={show}
      setShow={setShow}
      data={data}
      setData={setData}
      title={t("title")}
      submitBtnLabel={t("button.detail")}
      onSubmit={handleToBookingDetail}
    >
      <Box
        sx={{
          px: 2,
          py: 2,
          width: "100%",
          maxHeight: 400,
          overflow: "scroll"
        }}
      >
        {/* <Typography variant="h6" sx={{ mb: 2 }}>
          {t("title.booking")}
        </Typography> */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <CustomInput noNameValue={booking.date} label={tBooking("date")} />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <CustomInput
              noNameValue={`${booking?.bookingTimeSchedule?.timeStart?.split(":")[0]}:${
                booking?.bookingTimeSchedule?.timeStart?.split(":")[1]
              } - ${booking?.bookingTimeSchedule?.timeEnd?.split(":")[0]}:${
                booking?.bookingTimeSchedule?.timeEnd?.split(":")[1]
              }`}
              label={tBooking("time")}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <CustomInput noNameValue={booking?.bookingSchedule?.type} label={tSchedule("type")} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <CustomInput noNameValue={booking?.bookingOfPatient?.name} label={tPatient("name")} />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <CustomInput noNameValue={booking?.bookingOfPatient?.gender} label={tPatient("gender")} />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <CustomInput
              noNameValue={formatDate.format(new Date(booking?.bookingOfPatient?.dob), "DD/MM/YYYY")}
              label={tPatient("dob")}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <CustomInput noNameValue={booking?.reason} label={tBooking("reason")} multiline rows={6} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <CustomInput noNameValue={booking?.note} label={tBooking("note")} multiline rows={6} />
          </Grid>
        </Grid>
      </Box>
    </CustomModal>
  );
}

BookingInfoModal.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  setData: PropTypes.func.isRequired
};

export default BookingInfoModal;
