import * as React from "react";
import SearchIcon from "@mui/icons-material/Search";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Icon,
  Typography,
  IconButton
} from "@mui/material";
const columns = [
  { id: "idbooking", label: "ID", minWidth: 170 },
  { id: "date", label: "Date", minWidth: 100 },
  {
    id: "time",
    label: "Time",
    minWidth: 170,
    align: "right"
  },
  {
    id: "doctor",
    label: "Doctor",
    minWidth: 170,
    align: "right"
  },
  {
    id: "patient",
    label: "Density",
    minWidth: 170,
    align: "right"
  },
  {
    id: "rolebooking",
    label: "Booking",
    minWidth: 170,
    align: "right"
  },
  {
    id: "option",
    label: "",
    minWidth: 170,
    align: "right"
  }
];

function createData(idbooking, date, time, doctor, patient, rolebooking, option) {
  return { idbooking, date, time, doctor, patient, rolebooking, option };
}

const rows = [
  createData(1, "15/04/2022", "16:14", "Carrissa Nowell", "Leyla Kaman", "User", ""),
  createData(2, "23/10/2022", "8:26", "Christie Absalom", "Skippy Whiterod", "User", ""),
  createData(3, "20/08/2022", "8:40", "Cinderella Nolan", "Wilfrid Hoyt", "User", ""),
  createData(4, "18/11/2022", "14:19", "Pooh Matyushkin", "Kelby Largen", "Staff", ""),
  createData(5, "14/01/2023", "9:44", "Andie Gretham", "Tedmund Billitteri", "User", ""),
  createData(6, "29/08/2022", "12:28", "Cullan Fenemore", "Marigold Bedome", "User", "")
];

export default function BookingPage() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Typography variant="h4">Danh sách đặt lịch</Typography>
      <TablePagination
        rowsPerPageOptions={[5, 7, 10]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                  <b>{column.label}</b>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                  {columns.slice(0, 6).map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === "number" ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                  {columns.slice(6, 7).map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        <IconButton aria-label="search" color="success" onClick={() => alert(row.idbooking)}>
                          <SearchIcon />
                        </IconButton>
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
  );
}
