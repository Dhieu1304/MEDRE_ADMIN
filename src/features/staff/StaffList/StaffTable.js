import PropTypes from "prop-types";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  IconButton,
  useTheme
} from "@mui/material";

import { Link, useNavigate } from "react-router-dom";
import { CalendarMonth as CalendarMonthIcon, Search as SearchIcon } from "@mui/icons-material";

import { useTranslation } from "react-i18next";
import StaffRoleStatusButton from "../components/StaffRoleStatusButton";

import { Can } from "../../../store/AbilityStore";
import { staffActionAbility, staffStatuses } from "../../../entities/Staff";
import Staff from "../../../entities/Staff/Staff";
import { columnsIds } from "./utils";
import { useStaffGendersContantTranslation } from "../hooks/useConstantsTranslation";

function StaffTable({
  staffs,
  columns,
  showCols,
  notHaveAccessModal,
  editStaffRoleModal,
  blockStaffModal,
  unblockStaffModal
}) {
  const theme = useTheme();

  const { t: tStaffMessage } = useTranslation("staffEntity", { keyPrefix: "messages" });

  const [, staffGenderContantListObj] = useStaffGendersContantTranslation();

  const navigate = useNavigate();

  return (
    <TableContainer component={Paper} sx={{ mb: 4, height: 600 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {columns?.map((column) => {
              const firstColSx =
                column?.id === columnsIds.name
                  ? {
                      position: "sticky",
                      left: 0,
                      zIndex: 4
                    }
                  : {};

              return (
                <TableCell
                  key={column.id}
                  align="left"
                  style={{ minWidth: column.minWidth }}
                  sx={{
                    fontWeight: 600,
                    display: column.display,
                    zIndex: 1,
                    ...firstColSx
                  }}
                >
                  {column.label}
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {staffs.map((currentStaff) => {
            const staff = new Staff(currentStaff);
            return (
              <TableRow key={staff?.id}>
                <TableCell
                  align="left"
                  sx={{
                    display: "table-cell",
                    position: "sticky",
                    left: 0,
                    zIndex: 2,
                    minWidth: 120,
                    backgroundColor: "white"
                  }}
                >
                  {staff?.name}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{
                    display: showCols?.username ? "table-cell" : "none",
                    zIndex: 1
                  }}
                >
                  {staff?.username}
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    display: showCols?.phoneNumber ? "table-cell" : "none",
                    zIndex: 1
                  }}
                >
                  <Typography variant="inherit">{staff?.phoneNumber}</Typography>
                  {!staff.phoneVerified && (
                    <Typography variant="caption" color={theme.palette.error.light}>
                      {tStaffMessage("phoneVerifiedFailed")}
                    </Typography>
                  )}
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    display: showCols?.email ? "table-cell" : "none",
                    zIndex: 1
                  }}
                >
                  <Typography variant="inherit">{staff?.email}</Typography>
                  {!staff.emailVerified && (
                    <Typography variant="caption" color={theme.palette.error.light}>
                      {tStaffMessage("emailVerifiedFailed")}
                    </Typography>
                  )}
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    display: showCols?.address ? "table-cell" : "none",
                    zIndex: 1
                  }}
                >
                  {staff?.address}
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    display: showCols?.gender ? "table-cell" : "none",
                    zIndex: 1
                  }}
                >
                  {staffGenderContantListObj?.[staff?.gender]?.label}
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    display: showCols?.dob ? "table-cell" : "none",
                    zIndex: 1
                  }}
                >
                  {staff?.dob}
                </TableCell>

                <TableCell
                  align="left"
                  sx={{
                    display: showCols?.healthInsurance ? "table-cell" : "none",
                    zIndex: 1
                  }}
                >
                  {staff?.healthInsurance}
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    display: showCols?.description ? "table-cell" : "none",
                    zIndex: 1
                  }}
                >
                  {staff?.description}
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    display: showCols?.education ? "table-cell" : "none",
                    zIndex: 1
                  }}
                >
                  {staff?.education}
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    display: showCols?.certificate ? "table-cell" : "none",
                    zIndex: 1
                  }}
                >
                  {staff?.certificate}
                </TableCell>

                <TableCell
                  align="left"
                  sx={{
                    display: showCols?.role ? "table-cell" : "none",
                    zIndex: 1
                  }}
                >
                  <Can I={staffActionAbility.UPDATE_ROLE} a={staff}>
                    <StaffRoleStatusButton
                      variant={staff?.role}
                      onClick={() => {
                        editStaffRoleModal.setShow(true);
                        editStaffRoleModal.setData(staff);
                      }}
                    />
                  </Can>
                  <Can not I={staffActionAbility.UPDATE_ROLE} a={staff}>
                    <StaffRoleStatusButton
                      variant={staff?.role}
                      onClick={() => {
                        notHaveAccessModal.setShow(true);
                      }}
                    />
                  </Can>
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    display: showCols?.status ? "table-cell" : "none",
                    zIndex: 1
                  }}
                >
                  <Can I={staffActionAbility.BLOCK} a={staff}>
                    {staff?.blocked ? (
                      <StaffRoleStatusButton
                        variant={staffStatuses.STATUS_BLOCK}
                        onClick={() => {
                          unblockStaffModal.setShow(true);
                          unblockStaffModal.setData(staff);
                        }}
                      />
                    ) : (
                      <StaffRoleStatusButton
                        variant={staffStatuses.STATUS_UNBLOCK}
                        onClick={() => {
                          blockStaffModal.setShow(true);
                          blockStaffModal.setData(staff);
                        }}
                      />
                    )}
                  </Can>
                  <Can not I={staffActionAbility.BLOCK} a={staff}>
                    <StaffRoleStatusButton
                      variant={staff?.blocked ? staffStatuses.STATUS_BLOCK : staffStatuses.STATUS_UNBLOCK}
                      onClick={() => {
                        notHaveAccessModal.setShow(true);
                      }}
                    />
                  </Can>
                </TableCell>
                <TableCell align="left">
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center"
                    }}
                  >
                    <Link
                      to={`${staff?.id}/schedule`}
                      // onClick={() => {
                      //   navigate(`${staff?.id}/schedule`, { relative: true });
                      // }}
                    >
                      <CalendarMonthIcon fontSize="medium" sx={{ color: theme.palette.success.main }} />
                    </Link>
                    <IconButton
                      onClick={() => {
                        navigate(staff?.id, { relative: true });
                      }}
                    >
                      <SearchIcon fontSize="medium" sx={{ color: theme.palette.success.main }} />
                    </IconButton>
                  </Box>
                </TableCell>
                {/* <TableCell align="left">{row.description}</TableCell>
              <TableCell align="left">{row.education}</TableCell>
              <TableCell align="left">{row.certificate}</TableCell> */}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

StaffTable.propTypes = {
  staffs: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  showCols: PropTypes.object.isRequired,
  notHaveAccessModal: PropTypes.object.isRequired,
  editStaffRoleModal: PropTypes.object.isRequired,
  blockStaffModal: PropTypes.object.isRequired,
  unblockStaffModal: PropTypes.object.isRequired
};

export default StaffTable;
