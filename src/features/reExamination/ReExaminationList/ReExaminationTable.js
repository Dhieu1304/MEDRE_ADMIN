import PropTypes from "prop-types";

import { Table, TableBody, TableContainer, TableHead, TableRow, Paper, IconButton, useTheme, Checkbox } from "@mui/material";

import { useNavigate } from "react-router-dom";
import { Save as SaveIcon } from "@mui/icons-material";
import formatDate from "date-and-time";

import CustomTableCell, { customTableCellVariant } from "../../../components/CustomTable/CustomTableCell";
import { columnsIds } from "./utils";
// import { usePatientGendersContantTranslation } from "../hooks/usePatientConstantsTranslation";

function ReExaminationTable({ reExaminations, columns, showCols }) {
  const theme = useTheme();

  //   const [, patientGenderContantListObj] = usePatientGendersContantTranslation();

  const navigate = useNavigate();

  return (
    <TableContainer component={Paper} sx={{ mb: 4, height: 600 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {columns?.map((column) => {
              const minWidth = column?.minWidth;
              console.log("column: ", column);
              return column?.id === columnsIds.dateRemind ? (
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
          {reExaminations.map((reExamination) => {
            return (
              <TableRow key={reExamination?.id}>
                <CustomTableCell variant={customTableCellVariant.FIRST_BODY_CELL}>
                  {reExamination?.dateRemind && formatDate.format(new Date(reExamination?.dateRemind), "DD/MM/YYYY")}
                </CustomTableCell>

                <CustomTableCell hide={!showCols?.bookingDate}>
                  {reExamination?.reExamOfBooking?.date &&
                    formatDate.format(new Date(reExamination?.reExamOfBooking?.date), "DD/MM/YYYY")}
                </CustomTableCell>
                <CustomTableCell hide={!showCols?.dateReExam}>
                  {reExamination?.dateReExam && formatDate.format(new Date(reExamination?.dateReExam), "DD/MM/YYYY")}
                </CustomTableCell>

                <CustomTableCell hide={!showCols?.bookingUserPhoneNumber}>
                  {reExamination?.reExamOfBooking?.bookingOfUser?.phoneNumber}
                </CustomTableCell>
                <CustomTableCell hide={!showCols?.bookingUserEmail}>
                  {reExamination?.reExamOfBooking?.bookingOfUser?.email}
                </CustomTableCell>
                <CustomTableCell hide={!showCols?.bookingUserName}>
                  {reExamination?.reExamOfBooking?.bookingOfUser?.name}
                </CustomTableCell>

                <CustomTableCell hide={!showCols?.isRemind}>
                  <Checkbox value={reExamination?.isRemind} checked={reExamination?.isRemind} />
                </CustomTableCell>
                <CustomTableCell hide={!showCols?.isApply}>
                  <Checkbox value={reExamination?.isApply} checked={reExamination?.isApply} />
                </CustomTableCell>

                <CustomTableCell variant={customTableCellVariant.ACTION_BODY_CELL}>
                  <IconButton
                    onClick={() => {
                      navigate(reExamination?.id, { relative: true });
                    }}
                  >
                    <SaveIcon fontSize="medium" sx={{ color: theme.palette.success.main }} />
                  </IconButton>
                </CustomTableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

ReExaminationTable.propTypes = {
  reExaminations: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  showCols: PropTypes.object.isRequired
};

export default ReExaminationTable;
