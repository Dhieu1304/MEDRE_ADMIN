import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

import { Box, Button } from "@mui/material";
import qs from "query-string";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import staffServices from "../../../services/staffServices";
import { useFetchingStore } from "../../../store/FetchingApiStore/hooks";
import CustomOverlay from "../../../components/CustomOverlay";
import { useAppConfigStore } from "../../../store/AppConfigStore/hooks";
import { useCustomModal } from "../../../components/CustomModal/hooks";

import { NotHaveAccess, NotHaveAccessModal } from "../../auth";
import { EditStaffRoleModal, BlockStaffModal, AddStaffModal } from "../components";

import useObjDebounce from "../../../hooks/useObjDebounce";

import StaffFiltersForm from "./StaffFiltersForm";
import StaffTable from "./StaffTable";
import { WithExpertisesLoaderWrapper } from "../hocs";
import { columnsIds, createDefaultValues, initialShowCols } from "./utils";
import UnblockStaffModal from "../components/UnblockStaffModal";
import { Can } from "../../../store/AbilityStore";
import { staffActionAbility } from "../../../entities/Staff";
import Staff from "../../../entities/Staff/Staff";
import ListPageAction from "../../../components/ListPageAction/ListPageAction";
import ListPageTableWrapper from "../../../components/ListPageTableWrapper";
import ListPageTop from "../../../components/ListPageTop";

function StaffList({ expertisesList }) {
  const [isFirst, setIsFirst] = useState(true);
  const [countRender, setCountRender] = useState(1);
  const { locale } = useAppConfigStore();

  const [staffs, setStaffs] = useState([]);
  const [count, setCount] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();
  const { isLoading, fetchApi } = useFetchingStore();

  const notHaveAccessModal = useCustomModal();
  const editStaffRoleModal = useCustomModal();
  const blockStaffModal = useCustomModal();
  const unblockStaffModal = useCustomModal();
  const addStaffModal = useCustomModal();

  // functions for multilingual use

  const { t } = useTranslation("staffFeature", { keyPrefix: "StaffList" });
  const { t: tBtn } = useTranslation("staffFeature", { keyPrefix: "StaffList.button" });
  const { t: tStaff } = useTranslation("staffEntity", { keyPrefix: "properties" });

  // state is used to represent the visibility of the Menu
  // (This menu allows the user to hide or show custom columns)
  const [showTableColsMenu, setShowTableColsMenu] = useState(null);

  /*
    The keys of this object represent column-by-column visibility
    We will hide description, education, certificate, healthInsurance for the first time
  */
  const [showCols, setShowCols] = useState({
    ...initialShowCols,
    [columnsIds.username]: false,
    [columnsIds.description]: false,
    [columnsIds.education]: false,
    [columnsIds.certificate]: false,
    [columnsIds.healthInsurance]: false,
    [columnsIds.address]: false
  });

  const columns = useMemo(
    () => [
      {
        id: columnsIds.name,
        label: tStaff(columnsIds.name),
        minWidth: 200
      },
      {
        id: columnsIds.username,
        label: tStaff(columnsIds.username),
        minWidth: 150,
        hide: !showCols[columnsIds.username]
      },
      {
        id: columnsIds.phoneNumber,
        label: tStaff(columnsIds.phoneNumber),
        minWidth: 150,
        hide: !showCols[columnsIds.phoneNumber]
      },
      {
        id: columnsIds.email,
        label: tStaff(columnsIds.email),
        minWidth: 150,
        hide: !showCols[columnsIds.email]
      },
      {
        id: columnsIds.address,
        label: tStaff(columnsIds.address),
        minWidth: 150,
        hide: !showCols[columnsIds.address]
      },
      {
        id: columnsIds.gender,
        label: tStaff(columnsIds.gender),
        minWidth: 100,
        hide: !showCols[columnsIds.gender]
      },
      {
        id: columnsIds.dob,
        label: tStaff(columnsIds.dob),
        minWidth: 150,
        hide: !showCols[columnsIds.dob]
      },
      {
        id: columnsIds.healthInsurance,
        label: tStaff(columnsIds.healthInsurance),
        minWidth: 200,
        hide: !showCols[columnsIds.healthInsurance]
      },
      {
        id: columnsIds.description,
        label: tStaff(columnsIds.description),
        minWidth: 400,
        hide: !showCols[columnsIds.description]
      },
      {
        id: columnsIds.education,
        label: tStaff(columnsIds.education),
        minWidth: 150,
        hide: !showCols[columnsIds.education]
      },
      {
        id: columnsIds.certificate,
        label: tStaff(columnsIds.certificate),
        minWidth: 150,
        hide: !showCols[columnsIds.certificate]
      },

      {
        id: columnsIds.role,
        label: tStaff(columnsIds.role),
        minWidth: 120,
        hide: !showCols[columnsIds.role]
      },
      {
        id: columnsIds.status,
        label: tStaff(columnsIds.status),
        minWidth: 200,
        hide: !showCols[columnsIds.status]
      },
      {
        id: columnsIds.action,
        label: "",
        minWidth: 80
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

  const { email, phoneNumber, username, name, address, healthInsurance, description, education, certificate } = watch();
  // delay 1000ms for search string
  const { debouncedObj: searchDebounce } = useObjDebounce(
    {
      email,
      phoneNumber,
      username,
      name,
      address,
      healthInsurance,
      description,
      education,
      certificate
    },
    1000
  );

  const { expertises, limit, from, to, type, role, status, gender } = watch();
  // delay 1000ms for selection and datetime
  const { debouncedObj: filterDebounce } = useObjDebounce(
    {
      expertises,
      limit,
      from,
      to,
      type,
      role,
      status,
      gender
    },
    1000
  );

  const loadData = async ({ page }) => {
    const paramsObj = {
      ...watch(),
      expertise: watch().expertises,
      blocked: watch().status,
      page
    };

    await fetchApi(async () => {
      const res = await staffServices.getStaffList(paramsObj);

      let countData = 0;
      let staffsData = [];

      if (res.success) {
        staffsData = res?.staffs || [];
        countData = res?.count;
        setStaffs(staffsData);
        setCount(countData);

        return { success: true };
      }
      setStaffs([]);
      setCount(0);
      return { error: res.message };
    });
  };

  useEffect(() => {
    // console.log("isReset change");

    if (isFirst) {
      setIsFirst(false);
      setCountRender((prev) => prev + 1);
      return;
    }

    // Trong 2 lần useEffect đầu tiên thì ta lấy page theo watch().page (lấy từ location.search)
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

  const handleAfterEditStaffRole = async () => {
    await loadData({ page: watch().page });
  };

  const handleAfterBlockStaff = async () => {
    await loadData({ page: watch().page });
  };

  const handleAfterUnblockStaff = async () => {
    await loadData({ page: watch().page });
  };

  return (
    <>
      <CustomOverlay open={isLoading} />

      <Can I={staffActionAbility.VIEW} a={Staff.magicWord()}>
        <Box>
          <ListPageTop
            title={t("title")}
            filterFormNode={
              <FormProvider {...filterForm}>
                <StaffFiltersForm expertisesList={expertisesList} />
              </FormProvider>
            }
          />

          <ListPageAction
            leftAction={
              <Can I={staffActionAbility.ADD} a={Staff.magicWord()}>
                <Button
                  variant="contained"
                  onClick={() => {
                    addStaffModal.setShow(true);
                  }}
                  sx={{ ml: 2 }}
                >
                  {tBtn("add")}
                </Button>
              </Can>
            }
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
              <StaffTable
                staffs={staffs}
                notHaveAccessModal={notHaveAccessModal}
                editStaffRoleModal={editStaffRoleModal}
                blockStaffModal={blockStaffModal}
                unblockStaffModal={unblockStaffModal}
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

        {addStaffModal.show && <AddStaffModal show={addStaffModal.show} setShow={addStaffModal.setShow} />}
        {editStaffRoleModal.show && (
          <EditStaffRoleModal
            show={editStaffRoleModal.show}
            setShow={editStaffRoleModal.setShow}
            data={editStaffRoleModal.data}
            setData={editStaffRoleModal.setData}
            handleAfterEditStaffRole={handleAfterEditStaffRole}
          />
        )}

        {blockStaffModal.show && (
          <BlockStaffModal
            show={blockStaffModal.show}
            setShow={blockStaffModal.setShow}
            data={blockStaffModal.data}
            setData={blockStaffModal.setData}
            handleAfterBlockStaff={handleAfterBlockStaff}
          />
        )}

        {unblockStaffModal.show && (
          <UnblockStaffModal
            show={unblockStaffModal.show}
            setShow={unblockStaffModal.setShow}
            data={unblockStaffModal.data}
            setData={unblockStaffModal.setData}
            handleAfterUnblockStaff={handleAfterUnblockStaff}
          />
        )}

        {notHaveAccessModal.show && (
          <NotHaveAccessModal show={notHaveAccessModal.show} setShow={notHaveAccessModal.setShow} />
        )}
      </Can>

      <Can not I={staffActionAbility.VIEW} a={Staff.magicWord()}>
        <NotHaveAccess />
      </Can>
    </>
  );
}

StaffList.propTypes = {
  expertisesList: PropTypes.array.isRequired
};

export default WithExpertisesLoaderWrapper(StaffList);
