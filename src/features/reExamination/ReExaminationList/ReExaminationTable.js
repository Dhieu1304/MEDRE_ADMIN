import PropTypes from "prop-types";

import { Table, TableBody, TableContainer, TableHead, TableRow, Paper, IconButton, useTheme, Checkbox } from "@mui/material";

import { Save as SaveIcon } from "@mui/icons-material";
import formatDate from "date-and-time";

import { Controller, useFormContext } from "react-hook-form";
import CustomTableCell, { customTableCellVariant } from "../../../components/CustomTable/CustomTableCell";
import { columnsIds } from "./utils";
import CustomInput from "../../../components/CustomInput/CustomInput";
import { useFetchingStore } from "../../../store/FetchingApiStore";
import reExaminationServices from "../../../services/reExaminationServices";
// import { usePatientGendersContantTranslation } from "../hooks/usePatientConstantsTranslation";

function ReExaminationTable({ reExaminations, columns, showCols, handleAfterSaveReExamination }) {
  const theme = useTheme();

  const { watch, trigger, control } = useFormContext();
  //   const [, patientGenderContantListObj] = usePatientGendersContantTranslation();

  const isFormChange = (reExaminationForm, reExamination) => {
    const result = Object.keys(reExaminationForm).some((key) => {
      return reExaminationForm[key] !== reExamination?.[key];
    });
    return result;
  };
  const { fetchApi } = useFetchingStore();

  const handleSaveReExamination = async (id, { isApply, isRemind, dateReExam }) => {
    await fetchApi(async () => {
      const res = await reExaminationServices.updateReExamination({ id, isApply, isRemind, dateReExam });
      if (res?.success) {
        if (handleAfterSaveReExamination) await handleAfterSaveReExamination();
      }
      return { ...res };
    });
  };

  return (
    <TableContainer component={Paper} sx={{ mb: 4, height: 600 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {columns?.map((column) => {
              const minWidth = column?.minWidth;
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
          {reExaminations.map((reExamination, index) => {
            return (
              <TableRow key={reExamination?.id}>
                <CustomTableCell variant={customTableCellVariant.FIRST_BODY_CELL}>
                  {reExamination?.dateRemind && formatDate.format(new Date(reExamination?.dateRemind), "DD/MM/YYYY")}
                </CustomTableCell>

                <CustomTableCell hide={!showCols?.bookingDate}>
                  <CustomInput
                    control={control}
                    label=""
                    trigger={trigger}
                    name={`reExaminations[${index}].dateReExam`}
                    type="date"
                  />
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

                <CustomTableCell hide={!showCols?.isApply}>
                  <Controller
                    control={control}
                    trigger={trigger}
                    name={`reExaminations[${index}].isApply`}
                    render={({ field: { onChange, value } }) => {
                      return <Checkbox value={value} checked={value} onChange={onChange} />;
                    }}
                  />
                </CustomTableCell>

                <CustomTableCell hide={!showCols?.isRemind}>
                  <Controller
                    control={control}
                    trigger={trigger}
                    name={`reExaminations[${index}].isRemind`}
                    render={({ field: { onChange, value } }) => {
                      return <Checkbox value={value} checked={value} onChange={onChange} />;
                    }}
                  />
                </CustomTableCell>

                <CustomTableCell variant={customTableCellVariant.ACTION_BODY_CELL}>
                  {isFormChange(watch().reExaminations[index], reExamination) && (
                    <IconButton
                      onClick={async () => {
                        await handleSaveReExamination(reExamination?.id, watch().reExaminations[index]);
                      }}
                    >
                      <SaveIcon fontSize="medium" sx={{ color: theme.palette.success.main }} />
                    </IconButton>
                  )}
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
  showCols: PropTypes.object.isRequired,
  handleAfterSaveReExamination: PropTypes.func.isRequired
};

export default ReExaminationTable;
