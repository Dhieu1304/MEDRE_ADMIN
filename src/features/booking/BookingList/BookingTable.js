import PropTypes from "prop-types";

import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  useTheme,
  Typography,
  Button
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { Preview as PreviewIcon, Search as SearchIcon } from "@mui/icons-material";
import formatDate from "date-and-time";

import { useTranslation } from "react-i18next";
import CustomTableCell, { customTableCellVariant } from "../../../components/CustomTable/CustomTableCell";
import { columnsIds } from "./utils";

import CopyButton from "../../../components/CopyButton";
import { bookingStatuses } from "../../../entities/Booking";

function BookingTable({ bookings, columns, showCols, bookingAnInfoModal }) {
  const theme = useTheme();

  const navigate = useNavigate();

  const { t: tBookingStatuses } = useTranslation("bookingEntity", { keyPrefix: "constants.statuses" });
  const { t: tBookingPaymentStatuses } = useTranslation("bookingEntity", { keyPrefix: "constants.paymentStatuses" });

  const tableCells = (booking) => {
    return [
      {
        id: columnsIds?.patientPhoneNumber,
        render: () => booking?.bookingOfPatient?.phoneNumber
      },
      {
        id: columnsIds?.doctorName,
        render: () => booking?.bookingSchedule?.scheduleOfStaff?.name
      },
      {
        id: columnsIds?.date,
        render: () => booking?.date && formatDate.format(new Date(booking?.date), "DD/MM/YYYY")
      },
      {
        id: columnsIds?.time,
        render: () => (
          <Typography fontWeight={500} textAlign="center" fontSize={16}>
            {`${booking?.bookingTimeSchedule?.timeStart?.split(":")[0]}:${
              booking?.bookingTimeSchedule?.timeStart?.split(":")[1]
            }`}{" "}
            -{" "}
            {`${booking?.bookingTimeSchedule?.timeEnd?.split(":")[0]}:${
              booking?.bookingTimeSchedule?.timeEnd?.split(":")[1]
            }`}
          </Typography>
        )
      },
      {
        id: columnsIds?.type,
        render: () => booking?.bookingSchedule?.type
      },
      {
        id: columnsIds?.expertise,
        render: () => booking?.bookingSchedule?.scheduleExpertise?.name
      },
      {
        id: columnsIds?.ordinalNumber,
        render: () => booking?.ordinalNumber
      },
      {
        id: columnsIds?.status,
        render: () => {
          switch (booking?.bookingStatus) {
            case bookingStatuses.BOOKED:
              return (
                <Button
                  sx={{
                    width: "100%",
                    fontSize: 10,
                    bgcolor: theme.palette.success.light,
                    color: theme.palette.success.contrastText
                  }}
                >
                  {tBookingStatuses("booked")}
                </Button>
              );
            case bookingStatuses.CANCELED:
              return (
                <Button
                  sx={{
                    width: "100%",
                    fontSize: 10,
                    bgcolor: theme.palette.error.light,
                    color: theme.palette.error.contrastText
                  }}
                >
                  {tBookingStatuses("cancel")}
                </Button>
              );
            case bookingStatuses.WAITING:
            default:
              return (
                <Button
                  sx={{
                    width: "100%",
                    fontSize: 10,
                    bgcolor: theme.palette.warning.light,
                    color: theme.palette.warning.contrastText
                  }}
                >
                  {tBookingStatuses("waiting")}
                </Button>
              );
          }
        }
      },
      {
        id: columnsIds?.paymentStatus,
        render: () => {
          if (booking?.isPayment)
            return (
              <Button
                sx={{
                  width: "100%",
                  fontSize: 10,
                  bgcolor: theme.palette.success.light,
                  color: theme.palette.success.contrastText
                }}
              >
                {tBookingPaymentStatuses("paid")}
              </Button>
            );

          return (
            <Button
              sx={{
                width: "100%",
                fontSize: 10,
                bgcolor: theme.palette.warning.light,
                color: theme.palette.warning.contrastText
              }}
            >
              {tBookingPaymentStatuses("unpaid")}
            </Button>
          );
        }
      }
    ];
  };

  const renderCells = (cells) => {
    return cells?.map((cell) => {
      return (
        <CustomTableCell key={cell?.id} hide={!showCols?.[cell?.id]}>
          {cell?.render()}
        </CustomTableCell>
      );
    });
  };

  return (
    <TableContainer component={Paper} sx={{ mb: 4, height: 450 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {columns?.map((column) => {
              const minWidth = column?.minWidth;
              return column?.id === columnsIds.patientName ? (
                <CustomTableCell sx={{ minWidth }} key={column?.id} variant={customTableCellVariant.FIRST_HEAD_CELL}>
                  {column.label}
                </CustomTableCell>
              ) : (
                <CustomTableCell
                  sx={{ minWidth }}
                  hide={column?.hide}
                  key={column?.id}
                  variant={customTableCellVariant.HEAD_CELL}
                >
                  {column.label}
                </CustomTableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {bookings.map((booking) => {
            return (
              <TableRow key={booking?.id}>
                <CustomTableCell variant={customTableCellVariant.FIRST_BODY_CELL}>
                  {booking?.bookingOfPatient?.name}
                </CustomTableCell>

                {renderCells(tableCells(booking))}
                <CustomTableCell variant={customTableCellVariant.ACTION_BODY_CELL}>
                  <IconButton
                    onClick={() => {
                      navigate(booking?.id, { relative: true });
                    }}
                  >
                    <SearchIcon fontSize="medium" sx={{ color: theme.palette.success.main }} />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      if (booking) {
                        bookingAnInfoModal.setShow(true);
                        bookingAnInfoModal.setData(booking);
                      }
                    }}
                  >
                    <PreviewIcon fontSize="medium" sx={{ color: theme.palette.success.main }} />
                  </IconButton>

                  <CopyButton content={booking?.id} />
                </CustomTableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// {booking?.dob && formatDate.format(new Date(booking?.dob), "DD/MM/YYYY")}
BookingTable.propTypes = {
  bookings: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  showCols: PropTypes.object.isRequired,
  bookingAnInfoModal: PropTypes.object.isRequired
};

export default BookingTable;
