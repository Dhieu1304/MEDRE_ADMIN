import React, { useMemo } from "react";
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
import { staffActionAbility, staffGenders, staffStatus } from "../../../entities/Staff";
import Staff from "../../../entities/Staff/Staff";
import { useAppConfigStore } from "../../../store/AppConfigStore";

function StaffTable({ staffs, columns, showCols, notHaveAccessModal, editStaffRoleModal, editStaffStatusModal }) {
  const theme = useTheme();
  const { locale } = useAppConfigStore();

  const { t: tStaffMessage } = useTranslation("staffEntity", { keyPrefix: "messages" });
  const { t: tStaffGender } = useTranslation("staffEntity", { keyPrefix: "constants.genders" });

  const staffGendersObj = useMemo(() => {
    return {
      [staffGenders.MALE]: tStaffGender("male"),
      [staffGenders.FEMALE]: tStaffGender("female"),
      [staffGenders.OTHER]: tStaffGender("other")
    };
  }, [locale]);

  const navigate = useNavigate();

  return (
    <TableContainer component={Paper} sx={{ mb: 4 }}>
      <Table>
        <TableHead>
          <TableRow>
            {columns?.map((column) => {
              return (
                <TableCell
                  key={column.id}
                  align="left"
                  style={{ minWidth: column.minWidth }}
                  sx={{
                    fontWeight: 600,
                    display: column.display
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
                  component="th"
                  scope="row"
                  sx={{
                    display: showCols?.username ? "table-cell" : "none"
                  }}
                >
                  {staff?.username}
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    display: showCols?.phoneNumber ? "table-cell" : "none"
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
                    display: showCols?.email ? "table-cell" : "none"
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
                    display: showCols?.name ? "table-cell" : "none"
                  }}
                >
                  {staff?.name}
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    display: showCols?.address ? "table-cell" : "none"
                  }}
                >
                  {staff?.address}
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    display: showCols?.gender ? "table-cell" : "none"
                  }}
                >
                  {staffGendersObj?.[staff?.gender]}
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    display: showCols?.dob ? "table-cell" : "none"
                  }}
                >
                  {staff?.dob}
                </TableCell>

                <TableCell
                  align="left"
                  sx={{
                    display: showCols?.healthInsurance ? "table-cell" : "none"
                  }}
                >
                  {staff?.healthInsurance}
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    display: showCols?.description ? "table-cell" : "none"
                  }}
                >
                  {staff?.description}
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    display: showCols?.education ? "table-cell" : "none"
                  }}
                >
                  {staff?.education}
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    display: showCols?.certificate ? "table-cell" : "none"
                  }}
                >
                  {staff?.certificate}
                </TableCell>

                <TableCell
                  align="left"
                  sx={{
                    display: showCols?.role ? "table-cell" : "none"
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
                    display: showCols?.status ? "table-cell" : "none"
                  }}
                >
                  <Can I={staffActionAbility.BLOCK} a={staff}>
                    <StaffRoleStatusButton
                      variant={staff?.blocked ? staffStatus.STATUS_BLOCK : staffStatus.STATUS_UNBLOCK}
                      onClick={() => {
                        editStaffStatusModal.setShow(true);
                        editStaffStatusModal.setData(staff);
                      }}
                    />
                  </Can>
                  <Can not I={staffActionAbility.BLOCK} a={staff}>
                    <StaffRoleStatusButton
                      variant={staff?.blocked ? staffStatus.STATUS_BLOCK : staffStatus.STATUS_UNBLOCK}
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
  editStaffStatusModal: PropTypes.object.isRequired
};

export default StaffTable;
