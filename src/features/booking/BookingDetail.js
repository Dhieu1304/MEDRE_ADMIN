import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { Box, Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import bookingServices from "../../services/bookingServices";
import { useFetchingStore } from "../../store/FetchingApiStore";
import CustomInput from "../../components/CustomInput/CustomInput";

const columns = [
  { id: "component", label: "Component", width: "40%" },
  { id: "information", label: "Informantion", width: "60%" }
];
function createData(component, information) {
  return { component, information };
}

export default function BookingDetail() {
  const { control, trigger, handleSubmit } = useForm({
    defaultValues: {
      note: "",
      conclusion: ""
    }
  });
  const [booking, setBooking] = React.useState();
  const { t } = useTranslation("bookingPage", {
    keyPrefix: "bookingDetail"
  });

  const { fetchApi } = useFetchingStore();

  React.useEffect(() => {
    const loadData = async () => {
      await fetchApi(async () => {
        const res = await bookingServices.getBookingDetail("51c5c8e7-2529-4e77-b896-0c7e9bdeda7a");
        if (res.success) {
          setBooking(res.booking);
          return { ...res };
        }
        setBooking({});
        return { ...res };
      });
    };

    loadData();
  }, []);
  const rows = [
    createData(t("bookingDate"), booking?.date),
    createData(t("bookingStatus"), booking?.booking_status),
    createData(t("paymentStatus"), booking?.is_payment),
    createData(t("reason"), booking?.reason),
    createData(t("note"), booking?.note),
    createData(t("conclusion"), booking?.conclusion),
    createData(t("bookedAt"), booking?.bookedAt),
    createData(t("timeStart"), booking?.booking_time_schedule?.time_start),
    createData(t("timeEnd"), booking?.booking_time_schedule?.time_end),
    createData(t("type"), booking?.booking_schedule.type),
    createData(t("schedule_expertise"), booking?.booking_schedule?.schedule_expertise.name),
    createData(t("schedule_staff"), booking?.booking_schedule?.schedule_of_staff.name),
    createData(t("userBookName"), booking?.booking_of_user?.name),
    createData(t("userBookEmail"), booking?.booking_of_user?.email),
    createData(t("userBookPhone"), booking?.booking_of_user?.phone_number),
    createData(t("patientName"), booking?.booking_of_patient?.name),
    createData(t("patientPhone"), booking?.booking_of_patient?.phone_number),
    createData(t("patientGender"), booking?.booking_of_patient?.gender),
    createData(t("patientAddress"), booking?.booking_of_patient?.address),
    createData(t("patientDob"), booking?.booking_of_patient?.dob),
    createData(t("patientHealthInsurance"), booking?.booking_of_patient?.health_insurance)
  ];

  const handleSaveNote = async () => {
    // const data2 = {
    //   id: "51c5c8e7-2529-4e77-b896-0c7e9bdeda7a",
    //   note: data.note,
    //   conclusion: data.conclusion
    // };
    // alert(data2);
    await fetchApi(async () => {
      // await bookingServices.updateBooking(note);
      // const res = await bookingServices.updateBooking(note);
      // console.log(res);
      // return { ...res};
    });
  };
  return (
    <>
      <Typography variant="h4" component="h4">
        Chi tiết lịch khám
      </Typography>
      <Typography variant="h5" component="h5">
        Thông tin lịch khám
      </Typography>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 1000 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableBody>
              {rows.slice(0, 9).map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.component}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell sx={{ width: column.width }} key={column.id}>
                          {value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Typography variant="h5" component="h5">
        Thông tin bác sĩ
      </Typography>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 1000 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableBody>
              {rows.slice(9, 11).map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.component}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell sx={{ width: column.width }} key={column.id}>
                          {value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Typography variant="h5" component="h5">
        Thông tin bệnh nhân
      </Typography>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 1000 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableBody>
              {rows.slice(14, 20).map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.component}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell sx={{ width: column.width }} key={column.id}>
                          {value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Typography variant="h5" component="h5">
        Thông tin người đặt lịch
      </Typography>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 1000 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableBody>
              {rows.slice(11, 14).map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.component}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell sx={{ width: column.width }} key={column.id}>
                          {value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Box>
        <CustomInput
          control={control}
          trigger={trigger}
          rules={{
            required: "Bắt buộc"
          }}
          name="note"
          label="Ghi chú của bác sĩ"
          multiline
          rows={5}
        />
        <CustomInput
          control={control}
          trigger={trigger}
          rules={{
            required: "Bắt buộc"
          }}
          name="conclusion"
          label="Kết luận của bác sĩ"
          multiline
          rows={5}
        />
        <CustomInput
          control={control}
          trigger={trigger}
          rules={{
            required: "Bắt buộc"
          }}
          name="note"
          label="Ghi chú của bác sĩ"
          multiline
          rows={5}
        />
        <Button variant="contained" onClick={handleSubmit(handleSaveNote)}>
          save
        </Button>
      </Box>
    </>
  );
}
