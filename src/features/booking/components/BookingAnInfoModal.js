// import { useEffect, useState } from "react";
import formatDate from "date-and-time";
import PropTypes from "prop-types";

import { useTranslation } from "react-i18next";
import { Box, Grid, useTheme } from "@mui/material";
import { VideoCall as VideoCallIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";
import CustomModal from "../../../components/CustomModal/CustomModal";
// import { useFetchingStore } from "../../../store/FetchingApiStore";
// import bookingServices from "../../../services/bookingServices";
import CustomInput from "../../../components/CustomInput/CustomInput";
import CopyButton from "../../../components/CopyButton";
import routeConfig from "../../../config/routeConfig";
import { scheduleTypes } from "../../../entities/Schedule";
import { usePatientGendersContantTranslation } from "../../patient/hooks/usePatientConstantsTranslation";

function BookingAnInfoModal({ show, setShow, data, setData }) {
  // const [booking, setBooking] = useState({ ...data });
  const booking = { ...data };
  // const { fetchApi } = useFetchingStore();
  const theme = useTheme();
  const { t } = useTranslation("bookingFeature", {
    keyPrefix: "BookingAnInfoModal"
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

  const [, patientGenderContantListObj] = usePatientGendersContantTranslation();

  const handleToBookingDetail = () => {
    // console.log("handleToBookingDetail: ");
    window.open(`${routeConfig.booking}/${booking?.id}`, "_blank");
  };

  // console.log(data);

  // useEffect(() => {
  //   const bookingId = data?.id;
  //   const loadData = async () => {
  //     await fetchApi(async () => {
  //       const res = await bookingServices.getBookingDetailById(bookingId);

  //       if (res.success) {
  //         const bookingData = res.booking;
  //         setBooking(bookingData);
  //         return { ...res };
  //       }
  //       setBooking({});
  //       return { ...res };
  //     });
  //   };

  //   loadData();
  // }, []);

  return (
    <CustomModal
      show={show}
      setShow={setShow}
      data={data}
      setData={setData}
      title={t("title")}
      submitBtnLabel={t("button.detail")}
      onSubmit={handleToBookingDetail}
      width={800}
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 4
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center"
            }}
          >
            {booking?.bookingOfUser?.id && (
              <CopyButton content={booking?.bookingOfUser?.id} label={t("button.copyUserId")} />
            )}
            {booking?.bookingOfPatient?.id && (
              <CopyButton content={booking?.bookingOfPatient?.id} label={t("button.copyPatientId")} />
            )}
          </Box>

          {booking?.bookingSchedule?.type === scheduleTypes.TYPE_ONLINE && booking?.isPayment && booking?.code && (
            <Box
              component={Link}
              to={`${routeConfig.meeting}/${booking?.id}`}
              sx={{
                display: "flex",
                alignItems: "center",
                px: 2,
                py: 1,
                ml: 2,
                background: theme.palette.success.light,
                color: theme.palette.success.contrastText,
                borderRadius: 10,
                textDecoration: "none"
              }}
            >
              <VideoCallIcon sx={{ mr: 1 }} />
              {t("button.meet")}
            </Box>
          )}
        </Box>
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
            <CustomInput
              noNameValue={patientGenderContantListObj?.[booking?.bookingOfPatient?.gender]?.label}
              label={tPatient("gender")}
            />
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
          {/* <Grid item xs={12} sm={12} md={12} lg={12}>
            <CustomInput noNameValue={booking?.note} label={tBooking("note")} multiline rows={6} />
          </Grid> */}
        </Grid>
      </Box>
    </CustomModal>
  );
}

BookingAnInfoModal.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  setData: PropTypes.func.isRequired
};

export default BookingAnInfoModal;
