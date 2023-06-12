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
import formatDate from "date-and-time";

import { useTranslation } from "react-i18next";
import UserStatusButton from "../components/UserStatusButton";

import { Can } from "../../../store/AbilityStore";
import { userActionAbility, userStatuses } from "../../../entities/User";
import User from "../../../entities/User/User";
import CustomTableCell, { customTableCellVariant } from "../../../components/CustomTable/CustomTableCell";
import { columnsIds } from "./utils";
import { useUserGendersContantTranslation } from "../hooks/useUserConstantsTranslation";
import CopyButton from "../../../components/CopyButton";

function UserTable({ users, columns, showCols, notHaveAccessModal, blockUserModal, unblockUserModal }) {
  const theme = useTheme();

  const { t: tUserMessage } = useTranslation("userEntity", { keyPrefix: "messages" });

  const [, userGenderContantListObj] = useUserGendersContantTranslation();

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
          {users.map((currentUser) => {
            const user = new User(currentUser);
            return (
              <TableRow key={user?.id}>
                <CustomTableCell variant={customTableCellVariant.FIRST_BODY_CELL}>{user?.name}</CustomTableCell>

                <CustomTableCell hide={!showCols?.phoneNumber}>
                  <Typography variant="inherit">{user?.phoneNumber}</Typography>
                  {!user.phoneVerified && (
                    <Typography variant="caption" color={theme.palette.error.light}>
                      {tUserMessage("phoneVerifiedFailed")}
                    </Typography>
                  )}
                </CustomTableCell>

                <CustomTableCell hide={!showCols?.email}>
                  <Typography variant="inherit">{user?.email}</Typography>
                  {!user.emailVerified && (
                    <Typography variant="caption" color={theme.palette.error.light}>
                      {tUserMessage("emailVerifiedFailed")}
                    </Typography>
                  )}
                </CustomTableCell>

                <CustomTableCell hide={!showCols?.address}>{user?.address}</CustomTableCell>

                <CustomTableCell hide={!showCols?.gender}>{userGenderContantListObj[user?.gender]?.label}</CustomTableCell>

                <CustomTableCell hide={!showCols?.dob}>
                  {user?.dob && formatDate.format(new Date(user?.dob), "DD/MM/YYYY")}
                </CustomTableCell>

                <CustomTableCell hide={!showCols?.healthInsurance}>{user?.healthInsurance}</CustomTableCell>

                <CustomTableCell hide={!showCols?.status}>
                  <Can I={userActionAbility.BLOCK} a={user}>
                    {user?.blocked ? (
                      <UserStatusButton
                        variant={userStatuses.STATUS_BLOCK}
                        onClick={() => {
                          unblockUserModal.setShow(true);
                          unblockUserModal.setData(user);
                        }}
                      />
                    ) : (
                      <UserStatusButton
                        variant={userStatuses.STATUS_UNBLOCK}
                        onClick={() => {
                          blockUserModal.setShow(true);
                          blockUserModal.setData(user);
                        }}
                      />
                    )}
                  </Can>
                  <Can not I={userActionAbility.BLOCK} a={user}>
                    <UserStatusButton
                      variant={user?.blocked ? userStatuses.STATUS_BLOCK : userStatuses.STATUS_UNBLOCK}
                      onClick={() => {
                        notHaveAccessModal.setShow(true);
                      }}
                    />
                  </Can>
                </CustomTableCell>

                <CustomTableCell variant={customTableCellVariant.ACTION_BODY_CELL}>
                  <Link
                    to={`${user?.id}/booking`}
                    // onClick={() => {
                    //   navigate(`${user?.id}/schedule`, { relative: true });
                    // }}
                  >
                    <CalendarMonthIcon fontSize="medium" sx={{ color: theme.palette.success.main }} />
                  </Link>
                  <IconButton
                    onClick={() => {
                      navigate(user?.id, { relative: true });
                    }}
                  >
                    <SearchIcon fontSize="medium" sx={{ color: theme.palette.success.main }} />
                  </IconButton>
                  <CopyButton content={user?.id} />
                </CustomTableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

UserTable.propTypes = {
  users: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  showCols: PropTypes.object.isRequired,
  notHaveAccessModal: PropTypes.object.isRequired,
  blockUserModal: PropTypes.object.isRequired,
  unblockUserModal: PropTypes.object.isRequired
};

export default UserTable;
