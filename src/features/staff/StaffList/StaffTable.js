import PropTypes from "prop-types";

import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  useTheme
} from "@mui/material";

import { Link, useNavigate } from "react-router-dom";
import { CalendarMonth as CalendarMonthIcon, Search as SearchIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import formatDate from "date-and-time";

import StaffRoleStatusButton from "../components/StaffRoleStatusButton";

import { Can } from "../../../store/AbilityStore";
import { staffActionAbility, staffStatuses } from "../../../entities/Staff";
import Staff from "../../../entities/Staff/Staff";
import { columnsIds } from "./utils";
import { useStaffGendersContantTranslation } from "../hooks/useStaffConstantsTranslation";
import CustomTableCell, { customTableCellVariant } from "../../../components/CustomTable/CustomTableCell";
import CopyButton from "../../../components/CopyButton";

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
    <TableContainer component={Paper} sx={{ mb: 4, height: 500, width: "100%" }}>
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
          {staffs.map((currentStaff) => {
            const staff = new Staff(currentStaff);
            return (
              <TableRow key={staff?.id}>
                <CustomTableCell variant={customTableCellVariant.FIRST_BODY_CELL}>{staff?.name}</CustomTableCell>
                <CustomTableCell hide={!showCols?.username}>{staff?.username}</CustomTableCell>

                <CustomTableCell hide={!showCols?.phoneNumber}>
                  <Typography variant="inherit">{staff?.phoneNumber}</Typography>
                  {!staff.phoneVerified && (
                    <Typography variant="caption" color={theme.palette.error.light}>
                      {tStaffMessage("phoneVerifiedFailed")}
                    </Typography>
                  )}
                </CustomTableCell>

                <CustomTableCell hide={!showCols?.email}>
                  <Typography variant="inherit">{staff?.email}</Typography>
                  {!staff.emailVerified && (
                    <Typography variant="caption" color={theme.palette.error.light}>
                      {tStaffMessage("emailVerifiedFailed")}
                    </Typography>
                  )}
                </CustomTableCell>

                <CustomTableCell hide={!showCols?.address}>{staff?.address}</CustomTableCell>

                <CustomTableCell hide={!showCols?.gender}>
                  {staffGenderContantListObj?.[staff?.gender]?.label}
                </CustomTableCell>

                <CustomTableCell hide={!showCols?.dob}>
                  {staff?.dob && formatDate.format(new Date(staff?.dob), "DD/MM/YYYY")}
                </CustomTableCell>
                <CustomTableCell hide={!showCols?.healthInsurance}>{staff?.healthInsurance}</CustomTableCell>
                <CustomTableCell hide={!showCols?.description}>{staff?.description}</CustomTableCell>
                <CustomTableCell hide={!showCols?.education}>{staff?.education}</CustomTableCell>
                <CustomTableCell hide={!showCols?.certificate}>{staff?.certificate}</CustomTableCell>

                <CustomTableCell>
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
                </CustomTableCell>

                <CustomTableCell>
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
                </CustomTableCell>

                <CustomTableCell variant={customTableCellVariant.ACTION_BODY_CELL}>
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
                  <CopyButton content={staff?.id} />
                </CustomTableCell>
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
