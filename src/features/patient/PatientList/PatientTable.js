import PropTypes from "prop-types";

import { Table, TableBody, TableContainer, TableHead, TableRow, Paper, IconButton, useTheme } from "@mui/material";

import { useNavigate } from "react-router-dom";
import { Search as SearchIcon } from "@mui/icons-material";
import formatDate from "date-and-time";

import CustomTableCell, { customTableCellVariant } from "../../../components/CustomTable/CustomTableCell";
import { columnsIds } from "./utils";
import { usePatientGendersContantTranslation } from "../hooks/usePatientConstantsTranslation";

function PatientTable({ patients, columns, showCols }) {
  const theme = useTheme();

  const [, patientGenderContantListObj] = usePatientGendersContantTranslation();

  const navigate = useNavigate();

  return (
    <TableContainer component={Paper} sx={{ mb: 4, height: 600 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {columns?.map((column) => {
              const minWidth = column?.minWidth;
              return column?.id === columnsIds.name ? (
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
          {patients.map((patient) => {
            return (
              <TableRow key={patient?.id}>
                <CustomTableCell variant={customTableCellVariant.FIRST_BODY_CELL}>{patient?.name}</CustomTableCell>

                <CustomTableCell hide={!showCols?.phoneNumber}>{patient?.phoneNumber}</CustomTableCell>

                <CustomTableCell hide={!showCols?.address}>{patient?.address}</CustomTableCell>

                <CustomTableCell hide={!showCols?.gender}>
                  {patientGenderContantListObj[patient?.gender]?.label}
                </CustomTableCell>

                <CustomTableCell hide={!showCols?.dob}>
                  {patient?.dob && formatDate.format(new Date(patient?.dob), "DD/MM/YYYY")}
                </CustomTableCell>

                <CustomTableCell hide={!showCols?.healthInsurance}>{patient?.healthInsurance}</CustomTableCell>

                <CustomTableCell variant={customTableCellVariant.ACTION_BODY_CELL}>
                  <IconButton
                    onClick={() => {
                      navigate(patient?.id, { relative: true });
                    }}
                  >
                    <SearchIcon fontSize="medium" sx={{ color: theme.palette.success.main }} />
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

PatientTable.propTypes = {
  patients: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  showCols: PropTypes.object.isRequired
};

export default PatientTable;
