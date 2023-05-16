import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

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
import NoDataBox from "../../../components/NoDataBox";
import CustomPageTitle from "../../../components/CustomPageTitle";

function StaffList({ expertisesList }) {
  const [isFirst, setIsFirst] = useState(true);
  const [countRender, setCountRender] = useState(1);
  const { locale } = useAppConfigStore();

  const [staffs, setStaffs] = useState([]);
  const [count, setCount] = useState(0);

  const [openFilterMobile, setOpenFilterMobile] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");

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
        minWidth: 200,
        display: "table-cell"
      },
      {
        id: columnsIds.username,
        label: tStaff(columnsIds.username),
        minWidth: 150,
        display: showCols[columnsIds.username] ? "table-cell" : "none"
      },
      {
        id: columnsIds.phoneNumber,
        label: tStaff(columnsIds.phoneNumber),
        minWidth: 150,
        display: showCols[columnsIds.phoneNumber] ? "table-cell" : "none"
      },
      {
        id: columnsIds.email,
        label: tStaff(columnsIds.email),
        minWidth: 150,
        display: showCols[columnsIds.email] ? "table-cell" : "none"
      },
      {
        id: columnsIds.address,
        label: tStaff(columnsIds.address),
        minWidth: 150,
        display: showCols[columnsIds.address] ? "table-cell" : "none"
      },
      {
        id: columnsIds.gender,
        label: tStaff(columnsIds.gender),
        minWidth: 100,
        display: showCols[columnsIds.gender] ? "table-cell" : "none"
      },
      {
        id: columnsIds.dob,
        label: tStaff(columnsIds.dob),
        minWidth: 150,
        display: showCols[columnsIds.dob] ? "table-cell" : "none"
      },
      {
        id: columnsIds.healthInsurance,
        label: tStaff(columnsIds.healthInsurance),
        minWidth: 200,
        display: showCols[columnsIds.healthInsurance] ? "table-cell" : "none"
      },
      {
        id: columnsIds.description,
        label: tStaff(columnsIds.description),
        minWidth: 400,
        display: showCols[columnsIds.description] ? "table-cell" : "none"
      },
      {
        id: columnsIds.education,
        label: tStaff(columnsIds.education),
        minWidth: 150,
        display: showCols[columnsIds.education] ? "table-cell" : "none"
      },
      {
        id: columnsIds.certificate,
        label: tStaff(columnsIds.certificate),
        minWidth: 150,
        display: showCols[columnsIds.certificate] ? "table-cell" : "none"
      },

      {
        id: columnsIds.role,
        label: tStaff(columnsIds.role),
        minWidth: 120,
        display: showCols[columnsIds.role] ? "table-cell" : "none"
      },
      {
        id: columnsIds.status,
        label: tStaff(columnsIds.status),
        minWidth: 200,
        display: showCols[columnsIds.status] ? "table-cell" : "none"
      },
      {
        id: columnsIds.action,
        label: "",
        minWidth: 80,
        display: "table-cell"
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
  }, [...Object.values(filterDebounce), ...Object.values(searchDebounce)]);

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
          <CustomPageTitle
            title={t("title")}
            right={
              isMobile && (
                <Button
                  onClick={() => {
                    setOpenFilterMobile((prev) => !prev);
                  }}
                >
                  {openFilterMobile ? tBtn("hideFilterCollapse") : tBtn("showFilterCollapse")}
                </Button>
              )
            }
          />

          <Collapse in={!isMobile || openFilterMobile}>
            <FormProvider {...filterForm}>
              <StaffFiltersForm expertisesList={expertisesList} />
            </FormProvider>
          </Collapse>

          <Box
            sx={{
              display: "flex",
              flexDirection: { md: "row", xs: "column" },
              justifyContent: "space-between",
              alignItems: { md: "center", xs: "flex-start" }
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
              <Button
                color="inherit"
                onClick={() => {
                  reset(createDefaultValues());
                }}
                sx={{
                  display: { md: "none", xs: "flex" }
                }}
              >
                {tBtn("reset")}
                <RestartAltIcon />
              </Button>
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
              <Menu
                anchorEl={showTableColsMenu}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                keepMounted
                transformOrigin={{ vertical: "top", horizontal: "left" }}
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
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
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

            <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
              <Button
                color="inherit"
                onClick={() => {
                  reset(createDefaultValues());
                }}
                sx={{
                  display: {
                    md: "flex",
                    xs: "none"
                  }
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
                  p: 0,
                  mb: 0
                }}
              />
            </Box>
          </Box>

          {count ? (
            <>
              <StaffTable
                staffs={staffs}
                notHaveAccessModal={notHaveAccessModal}
                editStaffRoleModal={editStaffRoleModal}
                blockStaffModal={blockStaffModal}
                unblockStaffModal={unblockStaffModal}
                columns={columns}
                showCols={showCols}
              />

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
            </>
          ) : (
            <NoDataBox />
          )}
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
