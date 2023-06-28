import PropTypes from "prop-types";

import { Paper, Table, TableBody, TableContainer, TableHead, TableRow } from "@mui/material";
import CustomTableCell, { customTableCellVariant } from "../../../components/CustomTable/CustomTableCell";

function DataTable({ rows, columns, showCols }) {
  return (
    <TableContainer component={Paper} sx={{ mb: 4, height: 500, width: "100%" }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {columns?.map((column) => {
              const minWidth = column?.minWidth;
              return column?.fixed ? (
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
          {rows.map((row) => {
            return (
              <TableRow key={row?.id}>
                {columns?.map((column) => {
                  let hide;
                  let variant;

                  if (column?.fixed) {
                    variant = customTableCellVariant.FIRST_BODY_CELL;
                  } else if (column?.action) {
                    variant = customTableCellVariant.ACTION_BODY_CELL;
                  } else {
                    hide = !showCols[column?.id];
                  }

                  return (
                    <CustomTableCell key={column?.id} hide={hide} variant={variant}>
                      {column?.render(row)}
                    </CustomTableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

DataTable.propTypes = {
  rows: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  showCols: PropTypes.object.isRequired
};

export default DataTable;
