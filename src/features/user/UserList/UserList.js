import React, { useEffect, useMemo, useState } from "react";

import { Box } from "@mui/material";
import qs from "query-string";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

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
import ListPageAction from "../../../components/ListPageAction/ListPageAction";
import ListPageTableWrapper from "../../../components/ListPageTableWrapper";
import ListPageTop from "../../../components/ListPageTop";

function UserList() {
  const { locale } = useAppConfigStore();
  const [isFirst, setIsFirst] = useState(true);
  const [countRender, setCountRender] = useState(1);

  const [users, setUsers] = useState([]);
  const [count, setCount] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();
  const { isLoading, fetchApi } = useFetchingStore();

  const notHaveAccessModal = useCustomModal();
  const blockUserModal = useCustomModal();
  const unblockUserModal = useCustomModal();

  // functions for multilingual use

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

  const columns = useMemo(
    () => [
      {
        id: columnsIds.name,
        label: tUser(columnsIds.name),
        minWidth: 100
      },
      {
        id: columnsIds.phoneNumber,
        label: tUser(columnsIds.phoneNumber),
        minWidth: 100,
        hide: !showCols[columnsIds.phoneNumber]
      },
      {
        id: columnsIds.email,
        label: tUser(columnsIds.email),
        minWidth: 100,
        hide: !showCols[columnsIds.email]
      },
      {
        id: columnsIds.address,
        label: tUser(columnsIds.address),
        minWidth: 100,
        hide: !showCols[columnsIds.address]
      },
      {
        id: columnsIds.gender,
        label: tUser(columnsIds.gender),
        minWidth: 100,
        hide: !showCols[columnsIds.gender]
      },
      {
        id: columnsIds.dob,
        label: tUser(columnsIds.dob),
        minWidth: 100,
        hide: !showCols[columnsIds.dob]
      },
      {
        id: columnsIds.healthInsurance,
        label: tUser(columnsIds.healthInsurance),
        minWidth: 200,
        hide: !showCols[columnsIds.healthInsurance]
      },
      {
        id: columnsIds.status,
        label: tUser(columnsIds.status),
        minWidth: 200,
        hide: !showCols[columnsIds.status]
      },
      {
        id: columnsIds.action,
        label: "",
        minWidth: 100
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
  }, [...Object.values(filterDebounce), ...Object.values(searchDebounce), isReset]);

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
          table={
            <UserTable
              users={users}
              notHaveAccessModal={notHaveAccessModal}
              blockUserModal={blockUserModal}
              unblockUserModal={unblockUserModal}
              columns={columns}
              showCols={showCols}
            />
          }
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
