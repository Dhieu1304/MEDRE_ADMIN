import React, { useEffect, useMemo, useState } from "react";

import {
  Box,
  Typography,
  useMediaQuery,
  Collapse,
  Button,
  TablePagination,
  Pagination,
  MenuItem,
  Menu,
  Switch
} from "@mui/material";
import qs from "query-string";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { RestartAlt as RestartAltIcon } from "@mui/icons-material";

import userServices from "../../../services/userServices";
import { useFetchingStore } from "../../../store/FetchingApiStore/hooks";
import { useAppConfigStore } from "../../../store/AppConfigStore/hooks";
import { useCustomModal } from "../../../components/CustomModal/hooks";

import { NotHaveAccessModal } from "../../auth";

import useObjDebounce from "../../../hooks/useObjDebounce";

import UserFiltersForm from "./UserFiltersForm";
import UserTable from "./UserTable";

import { columnsIds, createDefaultValues, initialShowCols } from "./utils";
import { BlockUserModal, UnblockUserModal } from "../components";
import CustomOverlay from "../../../components/CustomOverlay/CustomOverlay";

function UserList() {
  const { locale } = useAppConfigStore();

  const [users, setUsers] = useState([]);
  const [count, setCount] = useState(0);

  const [openFilterMobile, setOpenFilterMobile] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");

  const location = useLocation();
  const navigate = useNavigate();
  const { isLoading, fetchApi } = useFetchingStore();

  const notHaveAccessModal = useCustomModal();
  const blockUserModal = useCustomModal();
  const unblockUserModal = useCustomModal();

  // functions for multilingual use

  const { t } = useTranslation("userFeature", { keyPrefix: "UserList" });
  const { t: tBtn } = useTranslation("userFeature", { keyPrefix: "UserList.button" });
  const { t: tUser } = useTranslation("userEntity", { keyPrefix: "properties" });

  // state is used to represent the visibility of the Menu
  // (This menu allows the user to hide or show custom columns)
  const [showTableColsMenu, setShowTableColsMenu] = useState(null);

  /*
    The keys of this object represent column-by-column visibility
    We will hide address, healthInsurance for the first time
  */
  const [showCols, setShowCols] = useState({
    ...initialShowCols,
    [columnsIds.healthInsurance]: false,
    [columnsIds.address]: false
  });

  const columns = useMemo(
    () => [
      {
        id: columnsIds.phoneNumber,
        label: tUser(columnsIds.phoneNumber),
        minWidth: 100,
        display: showCols[columnsIds.phoneNumber] ? "table-cell" : "none"
      },
      {
        id: columnsIds.email,
        label: tUser(columnsIds.email),
        minWidth: 100,
        display: showCols[columnsIds.email] ? "table-cell" : "none"
      },
      {
        id: columnsIds.name,
        label: tUser(columnsIds.name),
        minWidth: 100,
        display: showCols[columnsIds.name] ? "table-cell" : "none"
      },
      {
        id: columnsIds.address,
        label: tUser(columnsIds.address),
        minWidth: 100,
        display: showCols[columnsIds.address] ? "table-cell" : "none"
      },
      {
        id: columnsIds.gender,
        label: tUser(columnsIds.gender),
        minWidth: 100,
        display: showCols[columnsIds.gender] ? "table-cell" : "none"
      },
      {
        id: columnsIds.dob,
        label: tUser(columnsIds.dob),
        minWidth: 100,
        display: showCols[columnsIds.dob] ? "table-cell" : "none"
      },
      {
        id: columnsIds.healthInsurance,
        label: tUser(columnsIds.healthInsurance),
        minWidth: 200,
        display: showCols[columnsIds.healthInsurance] ? "table-cell" : "none"
      },
      {
        id: columnsIds.status,
        label: tUser(columnsIds.status),
        minWidth: 200,
        display: showCols[columnsIds.status] ? "table-cell" : "none"
      },
      {
        id: columnsIds.action,
        label: "",
        minWidth: 100,
        display: showCols[columnsIds.action] ? "table-cell" : "none"
      }
    ],
    [locale, showCols]
  );

  const defaultValues = useMemo(() => {
    const defaultSearchParams = qs.parse(location.search);
    const result = createDefaultValues(defaultSearchParams);
    return result;
  }, []);

  const filterForm = useForm({
    mode: "onChange",
    defaultValues,
    criteriaMode: "all"
  });

  const { watch, setValue, reset } = filterForm;

  const { email, phoneNumber, name, address, healthInsurance } = watch();
  // delay 1000ms for search string
  const { debouncedObj: searchDebounce } = useObjDebounce(
    {
      email,
      phoneNumber,
      name,
      address,
      healthInsurance
    },
    1000
  );

  const { limit, status, gender } = watch();
  // delay 1000ms for selection and datetime
  const { debouncedObj: filterDebounce } = useObjDebounce(
    {
      limit,
      status,
      gender
    },
    1000
  );

  const loadData = async ({ page }) => {
    const paramsObj = {
      ...watch(),
      blocked: watch().status,
      page
    };

    await fetchApi(async () => {
      const res = await userServices.getUserList(paramsObj);

      let countData = 0;
      let usersData = [];

      if (res.success) {
        usersData = res?.users || [];
        countData = res?.count;
        setUsers(usersData);
        setCount(countData);

        return { success: true };
      }
      setUsers([]);
      setCount(0);
      return { error: res.message };
    });
  };

  useEffect(() => {
    const page = 1;
    const params = { ...watch(), page };

    const searchParams = qs.stringify(params);
    setValue("page", page);
    navigate(`?${searchParams}`);
    loadData({ page });
  }, [...Object.values(filterDebounce), ...Object.values(searchDebounce)]);

  const handleAfterBlockUser = async () => {
    await loadData({ page: watch().page });
  };

  const handleAfterUnblockUser = async () => {
    await loadData({ page: watch().page });
  };

  users.forEach(() => {});

  return (
    <>
      <Box>
        <CustomOverlay open={isLoading} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            mb: 4
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <Typography variant="h4" component="h1" mr={2}>
              {t("title")}
            </Typography>
          </Box>
        </Box>
        {isMobile && (
          <Button
            onClick={() => {
              setOpenFilterMobile(!openFilterMobile);
            }}
          >
            {openFilterMobile ? tBtn("hideFilterCollapse") : tBtn("showFilterCollapse")}
          </Button>
        )}
        <Collapse in={!isMobile || openFilterMobile}>
          <FormProvider {...filterForm}>
            <UserFiltersForm />
          </FormProvider>
        </Collapse>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap"
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <Button
              variant="outlined"
              onClick={(event) => {
                setShowTableColsMenu(event.currentTarget);
              }}
            >
              {tBtn("showMenuColumns")}
            </Button>
            <Menu
              anchorEl={showTableColsMenu}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left"
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left"
              }}
              open={Boolean(showTableColsMenu)}
              onClose={() => {
                setShowTableColsMenu(null);
              }}
              sx={{
                maxHeight: 250
              }}
            >
              {columns
                .filter((column) => column.id in showCols)
                .map((column) => {
                  return (
                    <MenuItem
                      key={column.id}
                      sx={{
                        px: 2,
                        py: 0
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "100%"
                        }}
                      >
                        <Typography fontSize={10}>{column.label}</Typography>

                        <Switch
                          size="small"
                          checked={showCols[column.id] === true}
                          onChange={() => {
                            setShowCols((prev) => ({
                              ...prev,
                              [column.id]: !prev[column.id]
                            }));
                          }}
                        />
                      </Box>
                    </MenuItem>
                  );
                })}
            </Menu>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center"
            }}
          >
            <Button
              color="inherit"
              onClick={() => {
                reset(createDefaultValues());
              }}
              sx={{
                transform: "translateY(-25%)"
              }}
            >
              {tBtn("reset")}
              <RestartAltIcon />
            </Button>

            <TablePagination
              component="div"
              count={count}
              page={count === 0 ? 0 : watch().page - 1}
              onPageChange={(e, page) => {
                const newPage = page + 1;
                setValue("page", newPage);
                const params = { ...watch(), page: newPage };
                const searchParams = qs.stringify(params);
                navigate(`?${searchParams}`);
                loadData({ page: newPage });
              }}
              rowsPerPageOptions={[1, 10, 20, 50, 100]}
              rowsPerPage={watch().limit}
              onRowsPerPageChange={(e) => {
                const newLimit = parseInt(e.target.value, 10);
                setValue("limit", newLimit);
              }}
              sx={{
                mb: 2
              }}
            />
          </Box>
        </Box>

        <UserTable
          users={users}
          notHaveAccessModal={notHaveAccessModal}
          blockUserModal={blockUserModal}
          unblockUserModal={unblockUserModal}
          columns={columns}
          showCols={showCols}
        />

        {!!count && (
          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "flex-end", alignItems: "flex-end" }}>
            <Pagination
              count={Math.ceil(count / watch().limit)}
              color="primary"
              page={watch().page}
              sx={{
                display: "flex",
                justifyContent: "flex-end"
              }}
              onChange={(event, newPage) => {
                setValue("page", newPage);
                const params = { ...watch(), page: newPage };
                const searchParams = qs.stringify(params);
                navigate(`?${searchParams}`);
                loadData({ page: newPage });
              }}
            />
          </Box>
        )}
      </Box>

      {blockUserModal.show && (
        <BlockUserModal
          show={blockUserModal.show}
          setShow={blockUserModal.setShow}
          data={blockUserModal.data}
          setData={blockUserModal.setData}
          handleAfterBlockUser={handleAfterBlockUser}
        />
      )}

      {unblockUserModal.show && (
        <UnblockUserModal
          show={unblockUserModal.show}
          setShow={unblockUserModal.setShow}
          data={unblockUserModal.data}
          setData={unblockUserModal.setData}
          handleAfterUnblockUser={handleAfterUnblockUser}
        />
      )}

      {notHaveAccessModal.show && <NotHaveAccessModal show={notHaveAccessModal.show} setShow={notHaveAccessModal.setShow} />}
    </>
  );
}

export default UserList;
