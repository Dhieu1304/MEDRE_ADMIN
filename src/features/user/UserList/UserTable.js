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
import UserStatusButton from "../components/UserStatusButton";

import { Can } from "../../../store/AbilityStore";
import { userActionAbility, userGenders, userStatuses } from "../../../entities/User";
import User from "../../../entities/User/User";
import { useAppConfigStore } from "../../../store/AppConfigStore";

function UserTable({ users, columns, showCols, notHaveAccessModal, blockUserModal, unblockUserModal }) {
  const theme = useTheme();
  const { locale } = useAppConfigStore();

  const { t: tUserMessage } = useTranslation("userEntity", { keyPrefix: "messages" });
  const { t: tUserGender } = useTranslation("userEntity", { keyPrefix: "constants.genders" });

  const userGendersObj = useMemo(() => {
    return {
      [userGenders.MALE]: tUserGender("male"),
      [userGenders.FEMALE]: tUserGender("female"),
      [userGenders.OTHER]: tUserGender("other")
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
          {users.map((currentUser) => {
            const user = new User(currentUser);
            return (
              <TableRow key={user?.id}>
                <TableCell
                  align="left"
                  sx={{
                    display: showCols?.phoneNumber ? "table-cell" : "none"
                  }}
                >
                  <Typography variant="inherit">{user?.phoneNumber}</Typography>
                  {!user.phoneVerified && (
                    <Typography variant="caption" color={theme.palette.error.light}>
                      {tUserMessage("phoneVerifiedFailed")}
                    </Typography>
                  )}
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    display: showCols?.email ? "table-cell" : "none"
                  }}
                >
                  <Typography variant="inherit">{user?.email}</Typography>
                  {!user.emailVerified && (
                    <Typography variant="caption" color={theme.palette.error.light}>
                      {tUserMessage("emailVerifiedFailed")}
                    </Typography>
                  )}
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    display: showCols?.name ? "table-cell" : "none"
                  }}
                >
                  {user?.name}
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    display: showCols?.address ? "table-cell" : "none"
                  }}
                >
                  {user?.address}
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    display: showCols?.gender ? "table-cell" : "none"
                  }}
                >
                  {userGendersObj?.[user?.gender]}
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    display: showCols?.dob ? "table-cell" : "none"
                  }}
                >
                  {user?.dob}
                </TableCell>

                <TableCell
                  align="left"
                  sx={{
                    display: showCols?.healthInsurance ? "table-cell" : "none"
                  }}
                >
                  {user?.healthInsurance}
                </TableCell>

                <TableCell
                  align="left"
                  sx={{
                    display: showCols?.status ? "table-cell" : "none"
                  }}
                >
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
                  </Box>
                </TableCell>
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
