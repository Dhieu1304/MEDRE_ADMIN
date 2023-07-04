import { useMemo, useState } from "react";
import formatDate from "date-and-time";
import PropTypes from "prop-types";

import { useTranslation } from "react-i18next";
import { VideoCall as VideoCallIcon } from "@mui/icons-material";
import { Box, Grid, Tab, Tabs, useTheme } from "@mui/material";
import CustomModal from "../../../components/CustomModal/CustomModal";
import CustomInput from "../../../components/CustomInput/CustomInput";
import CopyButton from "../../../components/CopyButton";
import routeConfig from "../../../config/routeConfig";
import { scheduleTypes } from "../../../entities/Schedule";
import { Link } from "react-router-dom";

function BookingInfoModal({ show, setShow, data, setData }) {
  const [tabValue, setTabValue] = useState(data?.bookings?.[0]?.id);

  const theme = useTheme();
  // const [bookingsGroup, setBookingsGroup] = useState({});
  const { t } = useTranslation("bookingFeature", {
    keyPrefix: "BookingInfoModal"
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

  const [bookingsGroup, scheduleStartTime, scheduleEndTime, type] = useMemo(() => {
    const groups = data?.bookings?.reduce((acc, booking) => {
      return {
        ...acc,
        [booking?.id]: booking
      };
    }, {});

    const start = data?.scheduleStartTime;
    const end = data?.scheduleEndTime;
    const typeLabel = data?.typeLabel;
    return [groups, start, end, typeLabel];
  }, [data]);

  const handleToBookingDetail = () => {
    window.open(`${routeConfig.booking}/${tabValue}`, "_blank");
  };

  // console.log({ data });

  // useEffect(() => {
  //   // const bookingId = data?.id;
  //   const loadData = async () => {
  //     const bookingsGroupData = {};
  //     for (const bookingMini of data) {
  //       const bookingId = bookingMini?.id;

  //       await fetchApi(async () => {
  //         const res = await bookingServices.getBookingDetailById(bookingId);

  //         if (res.success) {
  //           const bookingData = res.booking;
  //           bookingsGroupData[bookingData?.id] = { ...bookingData };
  //           return { ...res };
  //         }

  //         return { ...res };
  //       });

  //       // await fetchApi(async () => {
  //       //   const res = await bookingServices.getBookingDetailById(bookingId);

  //       //   if (res.success) {
  //       //     const bookingData = res.booking;
  //       //     setBooking(bookingData);
  //       //     return { ...res };
  //       //   }
  //       //   setBooking({});
  //       //   return { ...res };
  //       // });
  //     }
  //     setBookingsGroup({ ...bookingsGroupData });
  //   };

  //   loadData();
  // }, []);

  // console.log(bookingsGroup?.[tabValue])

  return (
    <CustomModal
      show={show}
      setShow={setShow}
      data={data}
      setData={setData}
      title={t("title")}
      submitBtnLabel={t("button.detail")}
      onSubmit={handleToBookingDetail}
      width={1000}
    >
      <Box
        sx={{
          px: 2,
          py: 2,
          width: "100%"
        }}
      >
        {/* <Typography variant="h6" sx={{ mb: 2 }}>
          {t("title.booking")}
        </Typography> */}
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => {
            // console.log("newValue: ", newValue);
            setTabValue(newValue);
          }}
          sx={{
            mb: 2,
            mt: 0
          }}
        >
          {data?.bookings?.map((booking) => {
            return <Tab key={booking?.id} value={booking?.id} label={booking?.ordinalNumber} />;
          })}
        </Tabs>

        <Box
          sx={{
            maxHeight: 400,
            overflow: "scroll"
          }}
        >
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
              {bookingsGroup?.[tabValue]?.bookingOfUser?.id && (
                <CopyButton content={bookingsGroup?.[tabValue]?.bookingOfUser?.id} label={t("button.copyUserId")} />
              )}
              {bookingsGroup?.[tabValue]?.bookingOfPatient?.id && (
                <CopyButton content={bookingsGroup?.[tabValue]?.bookingOfPatient?.id} label={t("button.copyPatientId")} />
              )}
            </Box>

            {bookingsGroup?.[tabValue]?.bookingSchedule?.type === scheduleTypes.TYPE_ONLINE &&
              bookingsGroup?.[tabValue]?.isPayment &&
              bookingsGroup?.[tabValue]?.code && (
                <Box
                  component={Link}
                  to={`${routeConfig.meeting}/${bookingsGroup?.[tabValue]?.id}`}
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
              <CustomInput noNameValue={bookingsGroup?.[tabValue]?.date} label={tBooking("date")} />
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4}>
              <CustomInput
                noNameValue={`${scheduleStartTime?.split(":")[0]}:${scheduleStartTime?.split(":")[1]} - ${
                  scheduleEndTime?.split(":")[0]
                }:${scheduleEndTime?.split(":")[1]}`}
                label={tBooking("time")}
              />
            </Grid>
            {/* <Grid item xs={12} sm={12} md={4} lg={4}>
              <CustomInput
                noNameValue={
                  data?.schedule?.type === scheduleTypes.TYPE_OFFLINE
                    ? data?.schedule?.scheduleExpertise?.priceOffline
                    : data?.schedule?.scheduleExpertise?.priceOnline
                }
                label={tBooking("price")}
              />
            </Grid> */}
            <Grid item xs={12} sm={12} md={4} lg={4}>
              <CustomInput noNameValue={type} label={tSchedule("type")} />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <CustomInput noNameValue={bookingsGroup?.[tabValue]?.bookingOfPatient?.name} label={tPatient("name")} />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <CustomInput noNameValue={bookingsGroup?.[tabValue]?.bookingOfPatient?.gender} label={tPatient("gender")} />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <CustomInput
                noNameValue={formatDate.format(new Date(bookingsGroup?.[tabValue]?.bookingOfPatient?.dob), "DD/MM/YYYY")}
                label={tPatient("dob")}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <CustomInput noNameValue={bookingsGroup?.[tabValue]?.reason} label={tBooking("reason")} multiline rows={6} />
            </Grid>
            {/* <Grid item xs={12} sm={12} md={12} lg={12}>
              <CustomInput noNameValue={bookingsGroup?.[tabValue]?.note} label={tBooking("note")} multiline rows={6} />
            </Grid> */}
          </Grid>
        </Box>
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
