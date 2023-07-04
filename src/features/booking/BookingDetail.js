import {
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
  useTheme
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import qs from "query-string";

import formatDate from "date-and-time";
import { Link, useParams } from "react-router-dom";
import {
  CalendarMonth as CalendarMonthIcon,
  RestartAlt as RestartAltIcon,
  Save as SaveIcon,
  VideoCall as VideoCallIcon
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { decode } from "html-entities";
import { useAbility } from "@casl/react";
import { subject } from "@casl/ability";
import bookingServices from "../../services/bookingServices";
import { useFetchingStore } from "../../store/FetchingApiStore";
import { useAppConfigStore } from "../../store/AppConfigStore";
import { formatDateLocale } from "../../utils/datetimeUtil";
import { bookingActionAbility, bookingPaymentStatuses, bookingStatuses } from "../../entities/Booking/constant";
import CustomOverlay from "../../components/CustomOverlay/CustomOverlay";
import CustomPageTitle from "../../components/CustomPageTitle";
import CustomInput from "../../components/CustomInput/CustomInput";
import { scheduleTypes } from "../../entities/Schedule";
import routeConfig from "../../config/routeConfig";
import { mergeObjectsWithoutNullAndUndefined } from "../../utils/objectUtil";
import uploadServices from "../../services/uploadServices";
import CopyButton from "../../components/CopyButton";
import CustomHtmlInput from "../../components/CustomInput/CustomHtmlInput";
import { AbilityContext } from "../../store/AbilityStore";
import entities from "../../entities/entities";
import reExaminationServices from "../../services/reExaminationServices";
// import paymentServices from "../../services/paymentServices";

function BookingDetail() {
  const [booking, setBooking] = useState();
  const [file, setFile] = useState(null);

  // console.log("booking: ", booking);

  const [defaultValues, setDefaultValues] = useState({
    note: "",
    conclusion: "",
    prescription: "",
    dateReExam: ""
  });

  const { control, trigger, reset, watch, setValue, handleSubmit } = useForm({
    mode: "onChange",
    defaultValues,
    criteriaMode: "all"
  });

  const { t } = useTranslation("bookingFeature", { keyPrefix: "BookingDetail" });
  const { t: tBooking } = useTranslation("bookingEntity", { keyPrefix: "properties" });
  const { t: tBookingConstants } = useTranslation("bookingEntity", { keyPrefix: "constants" });
  const { t: tInputValidation } = useTranslation("input", { keyPrefix: "validation" });

  const params = useParams();
  const bookingId = useMemo(() => params?.bookingId, [params?.bookingId]);

  const { isLoading, fetchApi } = useFetchingStore();
  const { locale } = useAppConfigStore();
  const theme = useTheme();

  const ability = useAbility(AbilityContext);
  const canUpdateBookingConlusion = ability.can(bookingActionAbility.UPDATE_CONCLUSION, subject(entities.BOOKING, booking));
  // console.log("canUpdateBookingConlusion: ", canUpdateBookingConlusion);
  // console.log("booking: ", booking);
  const canUpdateBooking = ability.can(bookingActionAbility.UPDATE, entities.BOOKING);

  useMemo(() => {
    const code = locale?.slice(0, 2);
    const currentLocale = formatDateLocale[code] || formatDateLocale.en;
    formatDate.locale(currentLocale);
  }, [locale]);

  const bookingPaymentStatusListObj = useMemo(() => {
    return [
      {
        label: tBookingConstants("paymentStatuses.paid"),
        value: bookingPaymentStatuses.PAID
      },
      {
        label: tBookingConstants("paymentStatuses.unpaid"),
        value: bookingPaymentStatuses.UNPAID
      }
    ].reduce((obj, cur) => {
      return {
        ...obj,
        [cur?.value]: cur
      };
    }, {});
  }, [locale]);

  const loadData = async () => {
    await fetchApi(
      async () => {
        const res = await bookingServices.getBookingDetail(bookingId);

        if (res.success) {
          const bookingData = res.booking;
          setBooking(bookingData);

          let newDefaultValues = {
            ...mergeObjectsWithoutNullAndUndefined(defaultValues, bookingData),
            dateReExam: bookingData?.bookingReExam?.dateReExam || ""
          };

          if (newDefaultValues?.note) {
            newDefaultValues = {
              ...newDefaultValues,
              note: decode(newDefaultValues?.note)
            };
          }
          if (newDefaultValues?.conclusion) {
            newDefaultValues = {
              ...newDefaultValues,
              conclusion: decode(newDefaultValues?.conclusion)
            };
          }

          setDefaultValues(newDefaultValues);
          reset(newDefaultValues);

          return { ...res };
        }
        setBooking({});
        return { ...res };
      },
      { hideSuccessToast: true }
    );
  };
  useEffect(() => {
    loadData();
  }, []);
  const tableFirstCellProps = {
    component: "th",
    scope: "row",
    width: "40%",
    sx: {
      fontSize: {
        md: 16,
        xs: 10
      },
      verticalAlign: "top"
    }
  };

  const tableSecondCellProps = {
    align: "left",
    sx: {
      width: "40%",
      fontSize: {
        md: 16,
        xs: 10
      }
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      // reader.onload = (event) => {};
      setFile(e.target.files[0]);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const uploadImage = async (imageFile) => {
    await fetchApi(async () => {
      const res = await uploadServices.uploadImage(imageFile);

      if (res.success) {
        const image = res?.image;
        setValue("prescription", image);
        return { ...res };
      }
      return { ...res };
    });
  };

  const handleUpdateBooking = async ({ isPayment, bookingStatus }) => {
    const id = booking?.id;
    // console.log({ id, isPayment, bookingStatus });

    await fetchApi(async () => {
      const res = await bookingServices.updateBooking({ id, isPayment, bookingStatus });
      if (res?.success) {
        await loadData();
        return { ...res };
      }
      return { ...res };
    });
  };

  const handleSaveUpdateBookingByDoctor = async ({ note, conclusion, prescription, dateReExam }) => {
    const id = booking?.id;

    const conclusionWithoutHtml = watch()
      .conclusion?.replace(/<[^>]+>/g, "")
      .trim();
    const conclusionWithoutTabBreakLine = conclusionWithoutHtml?.replace(/\s+/g, " ").trim();

    if (!conclusionWithoutTabBreakLine) {
      setValue("conclusion", "");
      trigger("conclusion");
      return;
    }

    await fetchApi(async () => {
      const res = await bookingServices.updateBookingByDoctor({ id, note, conclusion, prescription });
      return { ...res };
    });

    if (dateReExam) {
      await fetchApi(async () => {
        const res = await reExaminationServices.createReExamination({ id, dateReExam });
        return { ...res };
      });
    }
  };

  // console.log("booking: ", booking);
  useEffect(() => {
    if (file) {
      uploadImage(file);
    }
  }, [file]);

  const disabledBtnSx = {
    width: { sm: "inherit", xs: "100%" },
    mb: { sm: 0, xs: 1 },
    ml: { sm: 1, xs: 0 },
    backgroundColor: "rgb(235, 235, 228)",
    color: "rgb(154, 153, 153)",
    ":hover": {
      backgroundColor: theme.palette.success.dark,
      color: theme.palette.success.contrastText
    }
  };

  const activeBtnSx = {
    width: { sm: "inherit", xs: "100%" },
    mb: { sm: 0, xs: 1 },
    ml: { sm: 1, xs: 0 },
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.contrastText,
    ":hover": {
      backgroundColor: theme.palette.success.dark,
      color: theme.palette.success.contrastText
    }
  };

  const renderHeaderRightButton = (bookingData) => {
    const defaultSx = {
      display: "flex",
      alignItems: "center",
      px: 2,
      py: 1,
      ml: 2,
      borderRadius: 10
    };

    const patientBookingSearchParams = {
      patientId: bookingData?.bookingOfPatient?.id,
      from: formatDate.format(new Date(2020, 0, 1), "YYYY-MM-DD")
    };
    const patientBookingSearchParamsUrl = qs.stringify(patientBookingSearchParams);

    return (
      <>
        <Box
          component={Link}
          to={`${routeConfig.booking}?${patientBookingSearchParamsUrl}`}
          sx={{
            ...defaultSx,
            textDecoration: "none",
            // background: theme.palette.info.light,
            color: theme.palette.info.light
          }}
        >
          <CalendarMonthIcon sx={{ mr: 1 }} />
          {t("button.oldBooking")}
        </Box>

        {bookingData?.bookingSchedule?.type === scheduleTypes.TYPE_ONLINE && bookingData?.isPayment && bookingData?.code && (
          <Box
            component={Link}
            to={`${routeConfig.meeting}/${bookingData?.id}`}
            sx={{
              ...defaultSx,
              textDecoration: "none",
              background: theme.palette.success.light,
              color: theme.palette.success.contrastText
            }}
          >
            <VideoCallIcon sx={{ mr: 1 }} />
            {t("button.meet")}
          </Box>
        )}
      </>
    );
  };

  return (
    <>
      <CustomOverlay open={isLoading} />
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <CustomPageTitle
          title={t("title")}
          right={
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end"
              }}
            >
              {canUpdateBooking && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  <Button
                    variant="contained"
                    size="small"
                    sx={booking?.isPayment ? activeBtnSx : disabledBtnSx}
                    onClick={async () => handleUpdateBooking({ isPayment: true })}
                  >
                    {t("button.paid")}
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    sx={!booking?.isPayment ? activeBtnSx : disabledBtnSx}
                    onClick={async () => handleUpdateBooking({ isPayment: false })}
                  >
                    {t("button.unpaid")}
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    sx={booking?.bookingStatus === bookingStatuses.BOOKED ? activeBtnSx : disabledBtnSx}
                    onClick={async () => handleUpdateBooking({ bookingStatus: bookingStatuses.BOOKED })}
                  >
                    {t("button.booked")}
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    sx={booking?.bookingStatus === bookingStatuses.WAITING ? activeBtnSx : disabledBtnSx}
                    onClick={async () => handleUpdateBooking({ bookingStatus: bookingStatuses.WAITING })}
                  >
                    {t("button.waiting")}
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    sx={booking?.bookingStatus === bookingStatuses.CANCELED ? activeBtnSx : disabledBtnSx}
                    onClick={async () => handleUpdateBooking({ bookingStatus: bookingStatuses.CANCELED })}
                  >
                    {t("button.cancel")}
                  </Button>
                </Box>
              )}
            </Box>
          }
        />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: {
              lg: "flex-end",
              xs: "flex-start"
            }
          }}
        >
          {canUpdateBooking && booking?.bookingOfUser?.id && (
            <CopyButton content={booking?.bookingOfUser?.id} label={t("button.copyUserId")} />
          )}
          {canUpdateBooking && booking?.bookingOfPatient?.id && (
            <CopyButton content={booking?.bookingOfPatient?.id} label={t("button.copyPatientId")} />
          )}

          {renderHeaderRightButton(booking)}
        </Box>
        {/*
          <Button
            variant="contained"
            size="small"
            onClick={() => {}}
            sx={{
              display: {
                sm: "flex",
                xs: "none"
              },
              backgroundColor: theme.palette.success.light,
              color: theme.palette.success.contrastText
            }}
            endIcon={<FileDownloadIcon />}
          >
            {t("button.exportFile")}
          </Button>

          <IconButton
            sx={{
              display: {
                sm: "none",
                xs: "flex"
              },
              color: theme.palette.success.light
            }}
          >
            <FileDownloadIcon />
          </IconButton> */}

        {/* , border: "1px solid rgba(0,0,0,0.2)" */}
        <Box
          sx={{
            flexDirection: "column",
            alignItems: "center",
            mb: 2,
            width: "100%",
            px: {
              md: 0,
              xs: 0
            }
          }}
        >
          <Box sx={{ flexDirection: "column", mb: 4 }}>
            <Typography
              component="h1"
              variant="h6"
              fontWeight={600}
              fontSize={{
                sm: 25,
                xs: 20
              }}
            >
              {t("subTitle.scheduleInfo")}
            </Typography>

            <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell {...tableFirstCellProps}>{tBooking("date")}</TableCell>
                    <TableCell {...tableSecondCellProps}>
                      {formatDate.format(new Date(booking?.date), "ddd, DD/MM/YY")}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell {...tableFirstCellProps}>{tBooking("ordinalNumber")}</TableCell>
                    <TableCell {...tableSecondCellProps}>{booking?.ordinalNumber}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell {...tableFirstCellProps}>{tBooking("time")}</TableCell>
                    <TableCell {...tableSecondCellProps}>
                      {`${booking?.bookingTimeSchedule?.timeStart?.split(":")[0]}:${
                        booking?.bookingTimeSchedule?.timeStart?.split(":")[1]
                      }`}{" "}
                      -{" "}
                      {`${booking?.bookingTimeSchedule?.timeEnd?.split(":")[0]}:${
                        booking?.bookingTimeSchedule?.timeEnd?.split(":")[1]
                      }`}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell {...tableFirstCellProps}>{tBooking("schedule.expertise")}</TableCell>
                    <TableCell {...tableSecondCellProps}>{booking?.bookingSchedule?.scheduleExpertise?.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell {...tableFirstCellProps}>{tBooking("paymentStatus")}</TableCell>
                    <TableCell {...tableSecondCellProps}>{bookingPaymentStatusListObj[booking?.isPayment]?.label}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell {...tableFirstCellProps}>{tBooking("reason")}</TableCell>
                    <TableCell {...tableSecondCellProps}>{booking?.reason}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box sx={{ flexDirection: "column", mb: 4 }}>
            <Typography
              component="h1"
              variant="h6"
              fontWeight={600}
              fontSize={{
                sm: 25,
                xs: 20
              }}
            >
              {t("subTitle.doctorInfo")}
            </Typography>

            <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell {...tableFirstCellProps}>{tBooking("doctor.name")}</TableCell>
                    <TableCell {...tableSecondCellProps}>{booking?.bookingSchedule?.scheduleOfStaff?.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell {...tableFirstCellProps}>{tBooking("doctor.expertises")}</TableCell>
                    <TableCell {...tableSecondCellProps}>{booking?.bookingSchedule?.scheduleExpertise?.name}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box sx={{ flexDirection: "column", mb: 4 }}>
            <Typography
              component="h1"
              variant="h6"
              fontWeight={600}
              fontSize={{
                sm: 25,
                xs: 20
              }}
            >
              {t("subTitle.patientInfo")}
            </Typography>

            <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell {...tableFirstCellProps}>{tBooking("patient.name")}</TableCell>
                    <TableCell {...tableSecondCellProps}>{booking?.bookingOfPatient?.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell {...tableFirstCellProps}>{tBooking("patient.dob")}</TableCell>
                    <TableCell {...tableSecondCellProps}>
                      {formatDate.format(new Date(booking?.bookingOfPatient?.dob), "DD/MM/YY")}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell {...tableFirstCellProps}>{tBooking("patient.phoneNumber")}</TableCell>
                    <TableCell {...tableSecondCellProps}>{booking?.bookingOfPatient?.phoneNumber}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell {...tableFirstCellProps}>{tBooking("patient.address")}</TableCell>
                    <TableCell {...tableSecondCellProps}>{booking?.bookingOfPatient?.address}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Box sx={{ flexDirection: "column", mb: 8 }}>
            <Typography
              component="h1"
              variant="h6"
              fontWeight={600}
              fontSize={{
                sm: 25,
                xs: 20
              }}
              sx={{
                mb: 4
              }}
            >
              {t("subTitle.doctorConclusion")}
            </Typography>
            <Grid container sx={{ mb: 4 }}>
              <Grid item lg={4} xs={12}>
                <CustomInput
                  showCanEditIcon
                  disabled={!canUpdateBookingConlusion}
                  control={control}
                  rules={{}}
                  label={tBooking("dateReExam")}
                  trigger={trigger}
                  name="dateReExam"
                  type="date"
                />
              </Grid>
            </Grid>

            <Box sx={{ mb: 4 }}>
              <CustomHtmlInput
                label={tBooking("conclusion")}
                disabled={!canUpdateBookingConlusion}
                control={control}
                name="conclusion"
                rules={{
                  required: tInputValidation("required")
                }}
              />
            </Box>
          </Box>

          <Box sx={{ flexDirection: "column", mb: 8 }}>
            <Typography
              component="h1"
              variant="h6"
              fontWeight={600}
              fontSize={{
                sm: 25,
                xs: 20
              }}
              sx={{
                mb: 4
              }}
            >
              {t("subTitle.doctorNote")}
            </Typography>

            <Box sx={{ mb: 4 }}>
              <CustomHtmlInput
                disabled={!canUpdateBookingConlusion}
                label={tBooking("note")}
                control={control}
                name="note"
                sx={{ height: 100 }}
              />
            </Box>
          </Box>

          <Box sx={{ flexDirection: "column", mb: 4 }}>
            <Typography
              component="h1"
              variant="h6"
              fontWeight={600}
              fontSize={{
                sm: 25,
                xs: 20
              }}
              sx={{
                mb: 4
              }}
            >
              {t("subTitle.doctorPrescription")}
            </Typography>
            <TextField disabled={!canUpdateBookingConlusion} type="file" onChange={handleImageChange} sx={{ mb: 4 }} />

            {watch().prescription && (
              <Box sx={{ mb: 4, border: "1px solid #ccc", borderRadius: 10, p: 4 }}>
                <Box
                  component="img"
                  sx={{
                    width: 400,
                    objectfit: "contain"
                  }}
                  variant="square"
                  src={watch().prescription}
                />
              </Box>
            )}
          </Box>

          {canUpdateBookingConlusion && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end"
              }}
            >
              <Button
                variant="contained"
                onClick={() => {
                  reset(defaultValues);
                }}
                sx={{
                  ml: 2,
                  bgcolor: theme.palette.warning.light
                }}
                startIcon={<RestartAltIcon color={theme.palette.warning.contrastText} />}
              >
                {t("button.reset")}
              </Button>

              <Button
                variant="contained"
                onClick={handleSubmit(handleSaveUpdateBookingByDoctor)}
                sx={{
                  ml: 2,
                  bgcolor: theme.palette.success.light
                }}
                startIcon={<SaveIcon color={theme.palette.success.contrastText} />}
              >
                {t("button.save")}
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
}

export default BookingDetail;
