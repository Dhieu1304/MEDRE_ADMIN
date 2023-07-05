import React, { useEffect, useMemo, useState } from "react";

import { Box, Typography, useTheme } from "@mui/material";
import qs from "query-string";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import formatDate from "date-and-time";

import { CalendarMonth as CalendarMonthIcon, Search as SearchIcon } from "@mui/icons-material";
import { useAbility } from "@casl/react";
import { subject } from "@casl/ability";
import userServices from "../../../services/userServices";
import { useFetchingStore } from "../../../store/FetchingApiStore/hooks";
import { useAppConfigStore } from "../../../store/AppConfigStore/hooks";
import { useCustomModal } from "../../../components/CustomModal/hooks";

import { NotHaveAccessModal } from "../../auth";

import useObjDebounce from "../../../hooks/useObjDebounce";

import UserFiltersForm from "./UserFiltersForm";

import { columnsIds, createDefaultValues, initialShowCols } from "./utils";
import { BlockUserModal, UnblockUserModal, UserStatusButton } from "../components";
import CustomOverlay from "../../../components/CustomOverlay/CustomOverlay";
import ListPageAction from "../../../components/ListPageAction/ListPageAction";
import ListPageTableWrapper from "../../../components/ListPageTableWrapper";
import ListPageTop from "../../../components/ListPageTop";
import { AbilityContext } from "../../../store/AbilityStore";
import { userActionAbility, userStatuses } from "../../../entities/User";
import { useUserGendersContantTranslation } from "../hooks/useUserConstantsTranslation";
import DataTable from "../../components/DataFilterTable/DataTable";
import CopyButton from "../../../components/CopyButton";
import routeConfig from "../../../config/routeConfig";
import entities from "../../../entities/entities";
import { getSortValue } from "../../../utils/objectUtil";

function UserList() {
  const { locale } = useAppConfigStore();
  const [isFirst, setIsFirst] = useState(true);
  const [countRender, setCountRender] = useState(1);

  const [users, setUsers] = useState([]);
  const [count, setCount] = useState(0);
  const [sort, setSort] = useState({
    sortBy: columnsIds.name,
    isAsc: true
  });

  const location = useLocation();
  const navigate = useNavigate();
  const { isLoading, fetchApi } = useFetchingStore();

  const notHaveAccessModal = useCustomModal();
  const blockUserModal = useCustomModal();
  const unblockUserModal = useCustomModal();

  const theme = useTheme();

  // functions for multilingual use

  const { t: tUserMessage } = useTranslation("userEntity", { keyPrefix: "messages" });

  const [, userGenderContantListObj] = useUserGendersContantTranslation();

  const { t } = useTranslation("userFeature", { keyPrefix: "UserList" });
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

  const ability = useAbility(AbilityContext);

  const columns = useMemo(
    () => [
      {
        id: columnsIds.name,
        haveSortIcon: true,
        label: tUser(columnsIds.name),
        minWidth: 100,
        render: (user) => user?.name,
        fixed: true
      },
      {
        id: columnsIds.phoneNumber,
        haveSortIcon: true,
        label: tUser(columnsIds.phoneNumber),
        minWidth: 100,
        hide: !showCols[columnsIds.phoneNumber],
        render: (user) => {
          return (
            <>
              <Typography variant="inherit">{user?.phoneNumber}</Typography>
              {!user.phoneVerified && (
                <Typography variant="caption" color={theme.palette.error.light}>
                  {tUserMessage("phoneVerifiedFailed")}
                </Typography>
              )}
            </>
          );
        }
      },
      {
        id: columnsIds.email,
        haveSortIcon: true,
        label: tUser(columnsIds.email),
        minWidth: 100,
        hide: !showCols[columnsIds.email],
        render: (user) => {
          return (
            <>
              <Typography variant="inherit">{user?.email}</Typography>
              {!user.emailVerified && (
                <Typography variant="caption" color={theme.palette.error.light}>
                  {tUserMessage("emailVerifiedFailed")}
                </Typography>
              )}
            </>
          );
        }
      },
      {
        id: columnsIds.address,
        label: tUser(columnsIds.address),
        minWidth: 100,
        hide: !showCols[columnsIds.address],
        render: (user) => user?.address
      },
      {
        id: columnsIds.gender,
        haveSortIcon: true,
        label: tUser(columnsIds.gender),
        minWidth: 100,
        hide: !showCols[columnsIds.gender],
        render: (user) => userGenderContantListObj?.[user?.gender]?.label
      },
      {
        id: columnsIds.dob,
        haveSortIcon: true,
        label: tUser(columnsIds.dob),
        minWidth: 100,
        hide: !showCols[columnsIds.dob],
        render: (user) => user?.dob && formatDate.format(new Date(user?.dob), "DD/MM/YYYY")
      },
      {
        id: columnsIds.healthInsurance,
        label: tUser(columnsIds.healthInsurance),
        minWidth: 200,
        hide: !showCols[columnsIds.healthInsurance],
        render: (user) => user?.healthInsurance
      },
      {
        id: columnsIds.status,
        haveSortIcon: true,
        label: tUser(columnsIds.status),
        minWidth: 200,
        hide: !showCols[columnsIds.status],
        render: (user) => {
          const canBlockUser = ability.can(userActionAbility.BLOCK, subject(entities.USER, user));

          return user?.blocked ? (
            <UserStatusButton
              isLabel={!canBlockUser}
              variant={userStatuses.STATUS_BLOCK}
              onClick={() => {
                if (canBlockUser) {
                  unblockUserModal.setShow(true);
                  unblockUserModal.setData(user);
                }
              }}
            />
          ) : (
            <UserStatusButton
              isLabel={!canBlockUser}
              variant={userStatuses.STATUS_UNBLOCK}
              onClick={() => {
                if (canBlockUser) {
                  blockUserModal.setShow(true);
                  blockUserModal.setData(user);
                }
              }}
            />
          );
        }
      },
      {
        id: columnsIds.action,
        label: "",
        minWidth: 100,
        render: (user) => {
          const userPath = routeConfig.user;

          const userBookingSearchParams = {
            userId: user?.id
          };
          const userBookingSearchParamsUrl = qs.stringify(userBookingSearchParams);

          return (
            <>
              <Box sx={{ ml: 2 }} component={Link} to={`${routeConfig.booking}?${userBookingSearchParamsUrl}`}>
                <CalendarMonthIcon fontSize="medium" sx={{ color: theme.palette.success.main }} />
              </Box>

              <Box sx={{ ml: 2 }} component={Link} to={`${userPath}/${user?.id}`}>
                <SearchIcon fontSize="medium" sx={{ color: theme.palette.success.main }} />
              </Box>

              <CopyButton content={user?.id} />
            </>
          );
        },
        action: true
      }
    ],
    [locale, showCols, users]
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

  const [isReset, setIsReset] = useState(false);

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
    const orderBy = sort.isAsc ? "asc" : "desc";
    let order;
    if (sort.sortBy) {
      //  { username, phoneNumber, email, name, dob, role, status }
      // console.log("columnsIds: ", columnsIds);
      const sortByFormat = getSortValue(
        columnsIds,
        {
          phoneNumber: "phone_number",
          email: "email",
          name: "name",
          gender: "gender",
          dob: "dob",
          status: "blocked"
        },
        sort.sortBy
      );

      // console.log("sortByFormat: ", sortByFormat);
      if (sortByFormat) {
        order = `${sortByFormat}:${orderBy}`;
      }
    }

    const paramsObj = {
      ...watch(),
      blocked: watch().status,
      page,
      order
    };

    await fetchApi(
      async () => {
        const res = await userServices.getUserList(paramsObj);

        let countData = 0;
        let usersData = [];

        if (res.success) {
          usersData = res?.users || [];
          countData = res?.count;
          setUsers(usersData);
          setCount(countData);

          return { ...res };
        }
        setUsers([]);
        setCount(0);
        return { ...res };
      },
      { hideSuccessToast: true }
    );
  };

  useEffect(() => {
    // console.log("isReset change");

    if (isFirst) {
      setIsFirst(false);
      setCountRender((prev) => prev + 1);
    }

    let page = 1;
    if (countRender <= 2) {
      page = watch().page;
      setCountRender((prev) => prev + 1);
    }

    const params = { ...watch(), page };

    const searchParams = qs.stringify(params);
    setValue("page", page);
    navigate(`?${searchParams}`);
    loadData({ page });
  }, [...Object.values(filterDebounce), ...Object.values(searchDebounce), isReset, sort]);

  const handleAfterBlockUser = async () => {
    await loadData({ page: watch().page });
  };

  const handleAfterUnblockUser = async () => {
    await loadData({ page: watch().page });
  };

  return (
    <>
      <Box>
        <CustomOverlay open={isLoading} />

        <ListPageTop
          title={t("title")}
          filterFormNode={
            <FormProvider {...filterForm}>
              <UserFiltersForm />
            </FormProvider>
          }
        />

        <ListPageAction
          showCols={showCols}
          setShowCols={setShowCols}
          showTableColsMenu={showTableColsMenu}
          setShowTableColsMenu={setShowTableColsMenu}
          reset={reset}
          setIsReset={setIsReset}
          createDefaultValues={createDefaultValues}
          columns={columns}
          setValue={setValue}
          loadData={loadData}
          watch={watch}
          count={count}
        />

        <ListPageTableWrapper
          table={<DataTable rows={users} columns={columns} showCols={showCols} sort={sort} setSort={setSort} />}
          count={count}
          watch={watch}
          loadData={loadData}
          setValue={setValue}
        />
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
