import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import qs from "query-string";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";

import formatDate from "date-and-time";
import { CalendarMonth as CalendarMonthIcon, Search as SearchIcon } from "@mui/icons-material";
import staffServices from "../../../services/staffServices";
import { useFetchingStore } from "../../../store/FetchingApiStore/hooks";
import CustomOverlay from "../../../components/CustomOverlay";
import { useAppConfigStore } from "../../../store/AppConfigStore/hooks";
import { useCustomModal } from "../../../components/CustomModal/hooks";

import { NotHaveAccess, NotHaveAccessModal } from "../../auth";
import { EditStaffRoleModal, BlockStaffModal, AddStaffModal, StaffRoleStatusButton } from "../components";

import useObjDebounce from "../../../hooks/useObjDebounce";

import StaffFiltersForm from "./StaffFiltersForm";
import { WithExpertisesLoaderWrapper } from "../hocs";
import { columnsIds, createDefaultValues, initialShowCols } from "./utils";
import UnblockStaffModal from "../components/UnblockStaffModal";
import { Can } from "../../../store/AbilityStore";
import { staffActionAbility, staffStatuses } from "../../../entities/Staff";
import Staff from "../../../entities/Staff/Staff";
import ListPageAction from "../../../components/ListPageAction/ListPageAction";
import ListPageTableWrapper from "../../../components/ListPageTableWrapper";
import ListPageTop from "../../../components/ListPageTop";
import { useStaffGendersContantTranslation } from "../hooks/useStaffConstantsTranslation";
import CopyButton from "../../../components/CopyButton";
import DataTable from "../../components/DataFilterTable/DataTable";

function StaffList({ expertisesList }) {
  const [isFirst, setIsFirst] = useState(true);
  const [countRender, setCountRender] = useState(1);
  const { locale } = useAppConfigStore();

  const [staffs, setStaffs] = useState([]);
  const [count, setCount] = useState(0);
  const [sort, setSort] = useState({
    sortBy: columnsIds.name,
    isAsc: true
  });

  const location = useLocation();
  const navigate = useNavigate();
  const { isLoading, fetchApi } = useFetchingStore();

  const notHaveAccessModal = useCustomModal();
  const editStaffRoleModal = useCustomModal();
  const blockStaffModal = useCustomModal();
  const unblockStaffModal = useCustomModal();
  const addStaffModal = useCustomModal();

  // functions for multilingual use

  const theme = useTheme();

  const { t: tStaffMessage } = useTranslation("staffEntity", { keyPrefix: "messages" });

  const [, staffGenderContantListObj] = useStaffGendersContantTranslation();

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
    [columnsIds.dob]: false,
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
        haveSortIcon: true,
        label: tStaff(columnsIds.name),
        minWidth: 200,
        render: (staff) => staff?.name,
        fixed: true
      },
      {
        id: columnsIds.username,
        haveSortIcon: true,
        label: tStaff(columnsIds.username),
        minWidth: 150,
        hide: !showCols[columnsIds.username],
        render: (staff) => staff?.username
      },
      {
        id: columnsIds.phoneNumber,
        haveSortIcon: true,
        label: tStaff(columnsIds.phoneNumber),
        minWidth: 150,
        hide: !showCols[columnsIds.phoneNumber],
        render: (staff) => {
          return (
            <>
              <Typography variant="inherit">{staff?.phoneNumber}</Typography>
              {!staff?.phoneVerified && (
                <Typography variant="caption" color={theme.palette.error.light}>
                  {tStaffMessage("phoneVerifiedFailed")}
                </Typography>
              )}
            </>
          );
        }
      },
      {
        id: columnsIds.email,
        haveSortIcon: true,
        label: tStaff(columnsIds.email),
        minWidth: 150,
        hide: !showCols[columnsIds.email],
        render: (staff) => {
          return (
            <>
              <Typography variant="inherit">{staff?.email}</Typography>
              {!staff?.emailVerified && (
                <Typography variant="caption" color={theme.palette.error.light}>
                  {tStaffMessage("emailVerifiedFailed")}
                </Typography>
              )}
            </>
          );
        }
      },
      {
        id: columnsIds.address,
        label: tStaff(columnsIds.address),
        minWidth: 150,
        hide: !showCols[columnsIds.address],
        render: (staff) => staff?.address
      },
      {
        id: columnsIds.gender,
        haveSortIcon: true,
        label: tStaff(columnsIds.gender),
        minWidth: 100,
        hide: !showCols[columnsIds.gender],
        render: (staff) => staffGenderContantListObj?.[staff?.gender]?.label
      },
      {
        id: columnsIds.dob,
        haveSortIcon: true,
        label: tStaff(columnsIds.dob),
        minWidth: 150,
        hide: !showCols[columnsIds.dob],
        render: (staff) => staff?.dob && formatDate.format(new Date(staff?.dob), "DD/MM/YYYY")
      },
      {
        id: columnsIds.healthInsurance,
        label: tStaff(columnsIds.healthInsurance),
        minWidth: 200,
        hide: !showCols[columnsIds.healthInsurance],
        render: (data) => data?.healthInsurance
      },
      {
        id: columnsIds.description,
        label: tStaff(columnsIds.description),
        minWidth: 400,
        hide: !showCols[columnsIds.description],
        render: (data) => data?.description
      },
      {
        id: columnsIds.education,
        label: tStaff(columnsIds.education),
        minWidth: 150,
        hide: !showCols[columnsIds.education],
        render: (data) => data?.education
      },
      {
        id: columnsIds.certificate,
        label: tStaff(columnsIds.certificate),
        minWidth: 150,
        hide: !showCols[columnsIds.certificate],
        render: (data) => data?.certificate
      },

      {
        id: columnsIds.role,
        haveSortIcon: true,
        label: tStaff(columnsIds.role),
        minWidth: 120,
        hide: !showCols[columnsIds.role],
        render: (staff) => {
          return (
            <>
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
                  isLabel
                  variant={staff?.role}
                  onClick={() => {
                    notHaveAccessModal.setShow(true);
                  }}
                />
              </Can>
            </>
          );
        }
      },
      {
        id: columnsIds.status,
        haveSortIcon: true,
        label: tStaff(columnsIds.status),
        minWidth: 200,
        hide: !showCols[columnsIds.status],
        render: (staff) => {
          return (
            <>
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
                {staff?.blocked ? (
                  <StaffRoleStatusButton
                    isLabel
                    variant={staffStatuses.STATUS_BLOCK}
                    onClick={() => {
                      unblockStaffModal.setShow(true);
                      unblockStaffModal.setData(staff);
                    }}
                  />
                ) : (
                  <StaffRoleStatusButton
                    isLabel
                    variant={staffStatuses.STATUS_UNBLOCK}
                    onClick={() => {
                      blockStaffModal.setShow(true);
                      blockStaffModal.setData(staff);
                    }}
                  />
                )}
              </Can>
            </>
          );
        }
      },
      {
        id: columnsIds.action,
        label: "",
        minWidth: 80,
        render: (staff) => {
          return (
            <>
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
            </>
          );
        },
        action: true
      }
    ],
    [locale, showCols, staffs]
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
    const orderBy = sort.isAsc ? "asc" : "desc";
    let order;
    if (sort.sortBy) {
      order = `${sort.sortBy}:${orderBy}`;
    }

    const paramsObj = {
      ...watch(),
      expertise: watch().expertises,
      blocked: watch().status,
      page,
      order
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
  }, [...Object.values(filterDebounce), ...Object.values(searchDebounce), isReset, sort]);

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
                <StaffFiltersForm expertises={expertisesList} />
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
            table={<DataTable rows={staffs} columns={columns} showCols={showCols} sort={sort} setSort={setSort} />}
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
