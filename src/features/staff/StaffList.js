import React, { useEffect, useMemo, useState } from "react";
import formatDate from "date-and-time";

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
  Grid,
  useMediaQuery,
  Collapse,
  Button,
  TablePagination,
  Pagination,
  CardHeader,
  Card,
  Avatar,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  IconButton,
  useTheme,
  CircularProgress,
  Menu,
  Switch
} from "@mui/material";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CalendarMonth as CalendarMonthIcon, RestartAlt as RestartAltIcon, Search as SearchIcon } from "@mui/icons-material";
import CustomInput, { CustomDateFromToInput } from "../../components/CustomInput";
import staffServices from "../../services/staffServices";
import { useFetchingStore } from "../../store/FetchingApiStore/hooks";
import CustomOverlay from "../../components/CustomOverlay";
import { useAppConfigStore } from "../../store/AppConfigStore/hooks";
import { useCustomModal } from "../../components/CustomModal/hooks";
import StaffRoleStatusButton from "./components/StaffRoleStatusButton";
import { NotHaveAccessModal } from "../auth";
import { EditStaffRoleModal, EditStaffStatusModal } from "./components";
import { Can } from "../../store/AbilityStore";
import { staffActionAbility } from "../../entities/Staff";
import Staff from "../../entities/Staff/Staff";
import useObjDebounce from "../../hooks/useObjDebounce";
import { normalizeStrToArray, normalizeStrToInt, normalizeStrToStr } from "../../utils/standardizedForForm";
// import { EditStaffStatusModal } from "./components";

export default function StaffList() {
  const [isFirst, setIsFirst] = useState(true);

  const [showTableColsMenu, setShowTableColsMenu] = useState(null);
  // const [showFiltersMenu, setShowFiltersMenu] = useState(null);

  const [showCols, setShowCols] = useState({
    username: true,
    phoneNumber: true,
    email: true,
    name: true,
    address: true,
    gender: true,
    dob: true,
    healthInsurance: false,
    description: false,
    education: false,
    certificate: false,
    role: true,
    status: true,
    action: true
  });

  // const [showFilters, setShowFilters] = useState({
  //   email: true,
  //   phoneNumber: true,
  //   username: true,
  //   name: true,
  //   types: true,
  //   expertises: true,
  //   page: true,
  //   limit: true,
  //   roles: true,
  //   statuses: true,
  //   genders: true,
  //   address: true,
  //   healthInsurance: true,
  //   description: true,
  //   education: true,
  //   certificate: true,
  //   date: true
  // });

  const showFilters = {
    email: true,
    phoneNumber: true,
    username: true,
    name: true,
    types: true,
    expertises: true,
    page: true,
    limit: true,
    roles: true,
    statuses: true,
    genders: true,
    address: true,
    healthInsurance: true,
    description: true,
    education: true,
    certificate: true,
    date: true
  };

  // const staffTypesList = useMemo(() => {
  //   return [
  //     {
  //       label: "Online",
  //       value: "Online"
  //     },
  //     {
  //       label: "Offline",
  //       value: "Offline"
  //     }
  //   ];
  // }, []);

  const [staffs, setStaffs] = useState([]);
  const [count, setCount] = useState(0);
  const [isFetchConfigSuccess, setIsFetchConfigSuccess] = useState(false);
  const [expertisesList, setExpertisesList] = useState([]);

  const [openFilterMobile, setOpenFilterMobile] = useState(false);

  const notHaveAccessModal = useCustomModal();
  const editStaffRoleModal = useCustomModal();
  const editStaffStatusModal = useCustomModal();

  const isMobile = useMediaQuery("(max-width:600px)");
  const isMd = useMediaQuery((theme) => theme.breakpoints.up("md"));

  const handleButtonClick = () => {
    setOpenFilterMobile(!openFilterMobile);
  };

  const location = useLocation();
  const navigate = useNavigate();
  const { isLoading, fetchApi } = useFetchingStore();
  const { locale } = useAppConfigStore();

  const { t } = useTranslation("staffFeature", { keyPrefix: "staff_list" });

  const theme = useTheme();

  const staffRoleListObj = useMemo(() => {
    const staffRoleList = [
      {
        label: t("role.admin"),
        value: "Admin"
      },
      {
        label: t("role.doctor"),
        value: "Doctor"
      },
      {
        label: t("role.nurse"),
        value: "Nurse"
      }
    ];

    return staffRoleList.reduce((obj, cur) => {
      return {
        ...obj,
        [cur?.value]: cur
      };
    }, {});
  }, [locale]);

  const staffGenderListObj = useMemo(() => {
    return [
      {
        label: t("gender.male"),
        value: "Male"
      },
      {
        label: t("gender.female"),
        value: "Female"
      }
    ].reduce((obj, cur) => {
      return {
        ...obj,
        [cur?.value]: cur
      };
    }, {});
  }, [locale]);

  const staffStatusListObj = useMemo(() => {
    return [
      {
        label: t("status.ok"),
        value: "Ok"
      },
      {
        label: t("status.block"),
        value: "Block"
      },
      {
        label: t("status.delete"),
        value: "Delete"
      }
    ].reduce((obj, cur) => {
      return {
        ...obj,
        [cur?.value]: cur
      };
    }, {});
  }, [locale]);

  const expertiseListObj = useMemo(() => {
    return expertisesList.reduce((obj, cur) => {
      return {
        ...obj,
        [cur?.id]: cur
      };
    }, {});
  }, [expertisesList]);

  const columns = useMemo(
    () => [
      { id: "username", label: t("table.username"), minWidth: 100, display: showCols.username ? "table-cell" : "none" },
      {
        id: "phoneNumber",
        label: t("table.phoneNumber"),
        minWidth: 100,
        display: showCols.phoneNumber ? "table-cell" : "none"
      },
      { id: "email", label: t("table.email"), minWidth: 100, display: showCols.email ? "table-cell" : "none" },
      { id: "name", label: t("table.name"), minWidth: 100, display: showCols.name ? "table-cell" : "none" },
      { id: "address", label: t("table.address"), minWidth: 100, display: showCols.address ? "table-cell" : "none" },
      { id: "gender", label: t("table.gender"), minWidth: 100, display: showCols.gender ? "table-cell" : "none" },
      { id: "dob", label: t("table.dob"), minWidth: 100, display: showCols.dob ? "table-cell" : "none" },
      {
        id: "healthInsurance",
        label: t("table.healthInsurance"),
        minWidth: 200,
        display: showCols.healthInsurance ? "table-cell" : "none"
      },
      {
        id: "description",
        label: t("table.description"),
        minWidth: 400,
        display: showCols.description ? "table-cell" : "none"
      },
      { id: "education", label: t("table.education"), minWidth: 100, display: showCols.education ? "table-cell" : "none" },
      {
        id: "certificate",
        label: t("table.certificate"),
        minWidth: 100,
        display: showCols.certificate ? "table-cell" : "none"
      },

      { id: "role", label: t("table.role"), minWidth: 100, display: showCols.role ? "table-cell" : "none" },
      { id: "status", label: t("table.status"), minWidth: 100, display: showCols.status ? "table-cell" : "none" },
      { id: "action", label: "", minWidth: 100, display: showCols.action ? "table-cell" : "none" }
      // { id: "description", label: "Description", minWidth: 150 },
      // { id: "education", label: "Education", minWidth: 100 },
      // { id: "certificate", label: "Certificate", minWidth: 100 }
    ],
    [locale, showCols]
  );

  const defaultValues = useMemo(() => {
    const defaultSearchParams = qs.parse(location.search);
    const {
      email,
      phoneNumber,
      username,
      name,
      types,
      expertises,
      page,
      limit,
      roles,
      statuses,
      genders,
      address,
      healthInsurance,
      description,
      education,
      certificate,
      from,
      to
    } = defaultSearchParams;

    const result = {
      // null hoặc undefined thì lấy giá trị default (bên phái)
      email: normalizeStrToStr(email),
      phoneNumber: normalizeStrToStr(phoneNumber),
      username: normalizeStrToStr(username),
      name: normalizeStrToStr(name),
      address: normalizeStrToStr(address),
      healthInsurance: normalizeStrToStr(healthInsurance),
      description: normalizeStrToStr(description),
      education: normalizeStrToStr(education),

      certificate: normalizeStrToStr(certificate),
      // đảm rằng chúng luôn là 1 array
      types: normalizeStrToArray(types),
      roles: normalizeStrToArray(roles),
      statuses: normalizeStrToArray(statuses),
      genders: normalizeStrToArray(genders),
      expertises: normalizeStrToArray(expertises),

      page: normalizeStrToInt(page, 1),
      limit: normalizeStrToInt(limit, 10),
      from: from ? formatDate.format(new Date(from), "YYYY-MM-DD") : formatDate.format(new Date(), "YYYY-MM-DD"),
      to: to ? formatDate.format(new Date(to), "YYYY-MM-DD") : formatDate.format(new Date(), "YYYY-MM-DD")
    };
    return result;
  }, []);

  const { control, trigger, watch, setValue, reset } = useForm({
    mode: "onChange",
    defaultValues,
    criteriaMode: "all"
  });

  const renderFilter = () => {
    const gridItemProps = {
      xs: 12,
      sm: 6,
      md: 4,
      lg: 3,
      sx: {
        p: 0,
        m: 0
      }
    };

    return (
      <Grid container spacing={{ xs: 2, md: 2 }} flexWrap="wrap" mb={4}>
        <Grid
          item
          {...gridItemProps}
          sx={{
            display: showFilters.name ? "block" : "none"
          }}
        >
          <CustomInput control={control} rules={{}} label={t("filter.search")} trigger={trigger} name="name" type="text" />
        </Grid>
        <Grid
          item
          {...gridItemProps}
          sx={{
            display: showFilters.email ? "block" : "none"
          }}
        >
          <CustomInput control={control} rules={{}} label={t("filter.email")} trigger={trigger} name="email" type="email" />
        </Grid>
        <Grid
          item
          {...gridItemProps}
          sx={{
            display: showFilters.phone ? "block" : "none"
          }}
        >
          <CustomInput control={control} rules={{}} label={t("filter.phone")} trigger={trigger} name="phoneNumber" />
        </Grid>
        <Grid
          item
          {...gridItemProps}
          sx={{
            display: showFilters.username ? "block" : "none"
          }}
        >
          <CustomInput control={control} rules={{}} label={t("filter.username")} trigger={trigger} name="username" />
        </Grid>
        <Grid
          item
          {...gridItemProps}
          sx={{
            display: showFilters.genders ? "block" : "none"
          }}
        >
          <CustomInput control={control} rules={{}} label={t("filter.gender")} trigger={trigger} name="genders">
            <Select
              multiple
              renderValue={(selected) => {
                if (Array.isArray(selected))
                  return selected
                    ?.map((cur) => {
                      return staffGenderListObj[cur]?.label;
                    })
                    ?.join(", ");
                return selected;
              }}
            >
              {Object.keys(staffGenderListObj).map((key) => {
                const item = staffGenderListObj[key];

                return (
                  <MenuItem key={item?.value} value={item?.value}>
                    {/* role không lấy theo ID nên để
                      checked={watch("role")?.indexOf(item?.value) > -1}   */}
                    <Checkbox checked={watch().genders?.indexOf(item?.value) > -1} />
                    <ListItemText primary={item?.label} />
                  </MenuItem>
                );
              })}
            </Select>
          </CustomInput>
        </Grid>
        <Grid
          item
          {...gridItemProps}
          sx={{
            display: showFilters.statuses ? "block" : "none"
          }}
        >
          <CustomInput control={control} rules={{}} label={t("filter.status")} trigger={trigger} name="statuses">
            <Select
              multiple
              renderValue={(selected) => {
                if (Array.isArray(selected))
                  return selected
                    ?.map((cur) => {
                      return staffStatusListObj[cur]?.label;
                    })
                    ?.join(", ");
                return selected;
              }}
            >
              {Object.keys(staffStatusListObj).map((key) => {
                const item = staffStatusListObj[key];
                return (
                  <MenuItem key={item?.value} value={item?.value}>
                    {/* role không lấy theo ID nên để
                      checked={watch("role")?.indexOf(item?.value) > -1}   */}
                    <Checkbox checked={watch().statuses?.indexOf(item?.value) > -1} />
                    <ListItemText primary={item?.label} />
                  </MenuItem>
                );
              })}
            </Select>
          </CustomInput>
        </Grid>
        <Grid
          item
          {...gridItemProps}
          sx={{
            display: showFilters.roles ? "block" : "none"
          }}
        >
          <CustomInput control={control} rules={{}} label={t("filter.role")} trigger={trigger} name="roles">
            <Select
              multiple
              renderValue={(selected) => {
                if (Array.isArray(selected))
                  return selected
                    ?.map((cur) => {
                      return staffRoleListObj[cur]?.label;
                    })
                    ?.join(", ");
                return selected;
              }}
            >
              {Object.keys(staffRoleListObj).map((key) => {
                const item = staffRoleListObj[key];
                return (
                  <MenuItem key={item?.value} value={item?.value}>
                    {/* role không lấy theo ID nên để
                      checked={watch("role")?.indexOf(item?.value) > -1}   */}
                    <Checkbox checked={watch().roles?.indexOf(item?.value) > -1} />
                    <ListItemText primary={item?.label} />
                  </MenuItem>
                );
              })}
            </Select>
          </CustomInput>
        </Grid>
        <Grid
          item
          {...gridItemProps}
          sx={{
            display: showFilters.expertises ? "block" : "none"
          }}
        >
          <CustomInput control={control} rules={{}} label={t("filter.expertise")} trigger={trigger} name="expertises">
            <Select
              multiple
              renderValue={(selected) => {
                if (Array.isArray(selected))
                  return selected
                    ?.map((cur) => {
                      return expertiseListObj[cur]?.name;
                    })
                    ?.join(", ");
                return selected;
              }}
            >
              {expertisesList.map((item) => {
                return (
                  <MenuItem key={item?.id} value={item?.id}>
                    <Checkbox checked={watch().expertises?.indexOf(item?.id) > -1} />
                    <ListItemText primary={item?.name} />
                  </MenuItem>
                );
              })}
            </Select>
          </CustomInput>
        </Grid>
        <Grid
          item
          {...gridItemProps}
          sx={{
            display: showFilters.address ? "block" : "none"
          }}
        >
          <CustomInput
            control={control}
            rules={{}}
            label={t("filter.address")}
            trigger={trigger}
            name="address"
            type="text"
          />
        </Grid>
        <Grid
          item
          {...gridItemProps}
          sx={{
            display: showFilters.description ? "block" : "none"
          }}
        >
          <CustomInput
            control={control}
            rules={{}}
            label={t("filter.description")}
            trigger={trigger}
            name="description"
            type="text"
          />
        </Grid>
        <Grid
          item
          {...gridItemProps}
          sx={{
            display: showFilters.education ? "block" : "none"
          }}
        >
          <CustomInput
            control={control}
            rules={{}}
            label={t("filter.education")}
            trigger={trigger}
            name="education"
            type="text"
          />
        </Grid>
        <Grid
          item
          {...gridItemProps}
          sx={{
            display: showFilters.certificate ? "block" : "none"
          }}
        >
          <CustomInput
            control={control}
            rules={{}}
            label={t("filter.certificate")}
            trigger={trigger}
            name="certificate"
            type="text"
          />
        </Grid>

        <Grid
          item
          {...gridItemProps}
          sx={{
            display: showFilters.healthInsurance ? "block" : "none"
          }}
        >
          <CustomInput
            control={control}
            rules={{}}
            label={t("filter.healthInsurance")}
            trigger={trigger}
            name="healthInsurance"
            type="text"
          />
        </Grid>
        <Grid
          item
          {...gridItemProps}
          sx={{
            display: showFilters.date ? "block" : "none"
          }}
        >
          <CustomDateFromToInput
            // control={control}
            // trigger={trigger}
            watchMainForm={watch}
            setMainFormValue={setValue}
            label="Lịch khám"
            fromDateName="from"
            fromDateRules={{}}
            toDateName="to"
            toDateRules={{}}
            fromDateLabel="From"
            toDateLabel="To"
          />
        </Grid>
      </Grid>
    );
  };

  const { email, phoneNumber, username, name, address, healthInsurance, description, education, certificate } = watch();
  const { debouncedObj: searchDebounce, isWaiting: isSearchWaiting } = useObjDebounce(
    { email, phoneNumber, username, name, address, healthInsurance, description, education, certificate },
    1000
  );

  const { types, date, roles, statuses, genders, expertises, limit, from, to } = watch();

  const { debouncedObj: filterDebounce, isWaiting: isFilterWaiting } = useObjDebounce(
    {
      types,
      date,
      roles,
      statuses,
      genders,
      expertises,
      limit,
      from,
      to
    },
    1000
  );

  const loadData = async ({ page }) => {
    // const expertise = [];
    const paramsObj = {
      // ...watch()
      // name: watch().name,
      // from: watch().date,
      // to: watch().date,
      limit: watch().limit,
      name: watch().name,
      email: watch().email,
      phoneNumber: watch().phoneNumber,
      username: watch().username,
      address: watch().address,
      healthInsurance: watch().healthInsurance,
      description: watch().description,
      education: watch().education,
      page
    };
    // if (!paramsObj.from) {
    //   delete paramsObj.from;
    // }
    // if (!paramsObj.to) {
    //   delete paramsObj.to;
    // }

    // console.log("watch(): ", watch());

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
      return;
    }

    const page = 1;
    const params = { ...watch(), page };

    const searchParams = qs.stringify(params);
    setValue("page", page);
    navigate(`?${searchParams}`);
    loadData({ page });
  }, [...Object.values(filterDebounce), ...Object.values(searchDebounce)]);

  const loadConfig = async () => {
    await fetchApi(async () => {
      const res = await staffServices.getStaffExpertises();

      if (res.success) {
        const expertisesData = res?.expertises;
        setExpertisesList(expertisesData);
        setIsFetchConfigSuccess(true);
        return { success: true };
      }
      setExpertisesList([]);
      setIsFetchConfigSuccess(true);
      return { error: res.message };
    });
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const handleAfterEditStaffRole = async () => {
    // await loadData();
  };

  const handleAfterEditStaffStatus = async () => {
    // await loadData();
  };

  const options = [
    "username",
    "phoneNumber",
    "email",
    "name",
    "address",
    "gender",
    "dob",
    "healthInsurance",
    "description",
    "education",
    "certificate",
    "role",
    "status",
    "action"
  ];

  return isFetchConfigSuccess ? (
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
            {(isSearchWaiting || isFilterWaiting) && <CircularProgress color="primary" size={24} thickness={3} />}
          </Box>
          {/*
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center"
            }}
          >
            <Button
              variant="outlined"
              onClick={(event) => {
                setShowFiltersMenu(event.currentTarget);
              }}
            >
              Show
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
                setShowFiltersMenu(null);
              }}
              sx={{
                maxHeight: 250
              }}
            >
              {defaultValues.map((option) => (
                <MenuItem
                  key={option}
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
                    <Typography fontSize={10}>{t(`filter.${option}`)}</Typography>

                    <Switch
                      size="small"
                      checked={showCols[option] === true}
                      onChange={() => {
                        setShowCols((prev) => ({
                          ...prev,
                          [option]: !prev[option]
                        }));
                      }}
                    />
                  </Box>
                </MenuItem>
              ))}
            </Menu>
          </Box> */}
        </Box>

        {isMobile && <Button onClick={handleButtonClick}>{openFilterMobile ? t("hide_filter") : t("show_filter")}</Button>}
        <Collapse in={!isMobile || openFilterMobile}>{renderFilter()}</Collapse>

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
              Show
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
              {options.map((option) => (
                <MenuItem
                  key={option}
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
                    <Typography fontSize={10}>{t(`table.${option}`)}</Typography>

                    <Switch
                      size="small"
                      checked={showCols[option] === true}
                      onChange={() => {
                        setShowCols((prev) => ({
                          ...prev,
                          [option]: !prev[option]
                        }));
                      }}
                    />
                  </Box>
                </MenuItem>
              ))}
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
                /*
              Giả sử ta ko filter gì hết là load đến page=5
              Khi đó ở trong useEffect() lắng nghe sự thay đổi của cách watch()
                - Bắt buộc phải có ít nhất 1 dependency là array hay obj
                - Bởi vì nếu chỉ có string hay number nó thì khi reset (do ta ko có dùng filter nào)
                nên giá trị của chúng ko bị thay đổi (còn array và object thì value của chúng có
                tham chiếu mới)
                => useEffect ko thực hiện => ko navigate đến ?page=1
                do đó params trên path vẫn là ?page=5
                => Lưu ý
              */
                reset(defaultValues);
              }}
              sx={{
                transform: "translateY(-25%)"
              }}
            >
              {t("filter.reset")}
              <RestartAltIcon />
            </Button>

            <TablePagination
              component="div"
              count={count}
              page={count === 0 ? 0 : watch().page - 1}
              // labelDisplayedRows={({ from, to, count }) => {
              //   console.log("{from, to, count}: ", { from, to, count });
              //   return "";
              // }}
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
                // const newPage = 1;
                // setValue("page", newPage);
                // const params = { ...watch(), page: newPage };
                // const searchParams = qs.stringify(params);
                // navigate(`?${searchParams}`);
                // loadData({ page: newPage });
              }}
              sx={{
                mb: 2
              }}
            />
          </Box>
        </Box>

        {isMd ? (
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  {columns.map((column) => {
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
                          display: showCols.username ? "table-cell" : "none"
                        }}
                      >
                        {staff?.username}
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          display: showCols.phoneNumber ? "table-cell" : "none"
                        }}
                      >
                        <Typography variant="inherit">{staff?.phoneNumber}</Typography>
                        {!staff.phoneVerified && (
                          <Typography variant="caption" color={theme.palette.error.light}>
                            {t("table.phoneVerifiedFailed")}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          display: showCols.email ? "table-cell" : "none"
                        }}
                      >
                        <Typography variant="inherit">{staff?.email}</Typography>
                        {!staff.emailVerified && (
                          <Typography variant="caption" color={theme.palette.error.light}>
                            {t("table.emailVerifiedFailed")}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          display: showCols.name ? "table-cell" : "none"
                        }}
                      >
                        {staff?.name}
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          display: showCols.address ? "table-cell" : "none"
                        }}
                      >
                        {staff?.address}
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          display: showCols.gender ? "table-cell" : "none"
                        }}
                      >
                        {staff?.gender}
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          display: showCols.dob ? "table-cell" : "none"
                        }}
                      >
                        {staff?.dob}
                      </TableCell>

                      <TableCell
                        align="left"
                        sx={{
                          display: showCols.healthInsurance ? "table-cell" : "none"
                        }}
                      >
                        {staff?.healthInsurance}
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          display: showCols.description ? "table-cell" : "none"
                        }}
                      >
                        {staff?.description}
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          display: showCols.education ? "table-cell" : "none"
                        }}
                      >
                        {staff?.education}
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          display: showCols.certificate ? "table-cell" : "none"
                        }}
                      >
                        {staff?.certificate}
                      </TableCell>

                      <TableCell
                        align="left"
                        sx={{
                          display: showCols.role ? "table-cell" : "none"
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
                          display: showCols.status ? "table-cell" : "none"
                        }}
                      >
                        <Can I={staffActionAbility.BLOCK} a={staff}>
                          <StaffRoleStatusButton
                            variant={staff?.status}
                            onClick={() => {
                              editStaffStatusModal.setShow(true);
                              editStaffStatusModal.setData(staff);
                            }}
                          />
                        </Can>
                        <Can not I={staffActionAbility.BLOCK} a={staff}>
                          <StaffRoleStatusButton
                            variant={staff?.status}
                            onClick={() => {
                              notHaveAccessModal.setShow(true);
                            }}
                          />
                        </Can>
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          display: showCols.action ? "table-cell" : "none"
                        }}
                      >
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
        ) : (
          staffs.map((staff) => (
            <Card
              key={staff?.id}
              sx={{
                height: "100%",
                maxWidth: "100%",
                display: "flex",
                flexDirection: "column",
                p: 0,
                cursor: "pointer",
                marginBottom: 4
              }}
            >
              <CardHeader
                avatar={<Avatar alt={staff?.name} src={staff?.image} />}
                title={staff?.name}
                subheader={
                  <Box>
                    <Typography>{staff?.role}</Typography>
                    <Typography>{staff?.phoneNumber}</Typography>
                    <Typography>
                      {t("table.status")}: {staff?.status}
                    </Typography>
                  </Box>
                }
                action={
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center"
                    }}
                  >
                    <IconButton
                      onClick={() => {
                        navigate(`${staff?.id}/schedule`, { relative: true });
                      }}
                    >
                      <CalendarMonthIcon sx={{ color: theme.palette.success.main }} />
                    </IconButton>

                    <IconButton
                      onClick={() => {
                        navigate(staff?.id, { relative: true });
                      }}
                    >
                      <SearchIcon sx={{ color: theme.palette.success.main }} />
                    </IconButton>
                  </Box>
                }
              />
            </Card>
          ))
        )}

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
      {editStaffRoleModal.show && (
        <EditStaffRoleModal
          show={editStaffRoleModal.show}
          setShow={editStaffRoleModal.setShow}
          data={editStaffRoleModal.data}
          setData={editStaffRoleModal.setData}
          handleAfterEditStaffRole={handleAfterEditStaffRole}
        />
      )}

      {editStaffStatusModal.show && (
        <EditStaffStatusModal
          show={editStaffStatusModal.show}
          setShow={editStaffStatusModal.setShow}
          data={editStaffStatusModal.data}
          setData={editStaffStatusModal.setData}
          handleAfterEditStaffStatus={handleAfterEditStaffStatus}
        />
      )}

      {notHaveAccessModal.show && (
        <NotHaveAccessModal
          show={notHaveAccessModal.show}
          setShow={notHaveAccessModal.setShow}
          data={notHaveAccessModal.data}
          setData={notHaveAccessModal.setData}
        />
      )}
    </>
  ) : (
    <CustomOverlay open={isLoading} />
  );
}
