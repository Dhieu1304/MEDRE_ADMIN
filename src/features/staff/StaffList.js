import React, { useEffect, useMemo, useState } from "react";

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
  useTheme
} from "@mui/material";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CalendarMonth as CalendarMonthIcon, RestartAlt as RestartAltIcon, Search as SearchIcon } from "@mui/icons-material";
import CustomStaffInput from "./components/CustomStaffInput";
import staffServices from "../../services/staffServices";
import { useFetchingStore } from "../../store/FetchingApiStore/hooks";
import CustomOverlay from "../../components/CustomOverlay";
import { useAppConfigStore } from "../../store/AppConfigStore/hooks";
import useDebounce from "../../hooks/useDebounce";
import { useCustomModal } from "../../components/CustomModal/hooks";
import StaffRoleStatusButton from "./components/StaffRoleStatusButton";
import { NotHaveAccessModal } from "../auth";
import { EditStaffRoleModal, EditStaffStatusModal } from "./components";
import { Can } from "../../store/AbilityStore";
import { staffActionAbility } from "../../entities/Staff";
// import { EditStaffStatusModal } from "./components";

export default function StaffList() {
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
      { id: "username", label: t("table.username"), minWidth: 100, display: { lg: "table-cell" } },
      { id: "phone_number", label: t("table.phone_number"), minWidth: 100, display: { lg: "table-cell" } },
      { id: "email", label: t("table.email"), minWidth: 150, display: { lg: "table-cell" } },
      { id: "name", label: t("table.name"), minWidth: 100, display: { lg: "table-cell" } },
      { id: "address", label: t("table.address"), minWidth: 150, display: { lg: "table-cell", md: "none", sm: "none" } },
      { id: "gender", label: t("table.gender"), minWidth: 50, display: { lg: "table-cell", md: "none", sm: "none" } },
      { id: "dob", label: t("table.dob"), minWidth: 100, display: { lg: "table-cell", md: "none", sm: "none" } },
      { id: "role", label: t("table.role"), minWidth: 100, display: { lg: "table-cell" } },
      { id: "status", label: t("table.status"), minWidth: 50, display: { lg: "table-cell" } },
      { id: "action", label: "", minWidth: 50, display: { lg: "table-cell" } }
      // { id: "description", label: "Description", minWidth: 150 },
      // { id: "education", label: "Education", minWidth: 100 },
      // { id: "certificate", label: "Certificate", minWidth: 100 }
    ],
    [locale]
  );

  const defaultValues = useMemo(() => {
    const defaultSearchParams = qs.parse(location.name);

    const { name, type, date, expertise, page, limit, roles, statuses, genders } = defaultSearchParams;

    return {
      name: name || "",
      type: Array.isArray(type) ? type : [],
      // date: date || formatDate.format(new Date(2023, 2, 12), "YYYY-MM-DD"),
      date,
      // from: from || formatDate.format(new Date(2023, 2, 12), "YYYY-MM-DD"),
      // to: formatDate.format(new Date(2023, 2, 14), "YYYY-MM-DD"),
      roles: Array.isArray(roles) ? roles : [],
      statuses: Array.isArray(statuses) ? statuses : [],
      genders: Array.isArray(genders) ? genders : [],
      expertise: Array.isArray(expertise) ? expertise : [],
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10
    };
  }, []);

  const { control, trigger, watch, setValue, reset } = useForm({
    mode: "onChange",
    defaultValues,
    criteriaMode: "all"
  });

  const renderFilter = () => {
    return (
      <Grid container spacing={{ xs: 2, md: 2 }} flexWrap="wrap" mb={4}>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          sx={{
            p: 0,
            m: 0
          }}
        >
          <CustomStaffInput
            control={control}
            rules={{}}
            label={t("filter.search")}
            trigger={trigger}
            name="name"
            type="text"
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          sx={{
            p: 0,
            m: 0
          }}
        >
          <CustomStaffInput
            control={control}
            rules={{}}
            label={t("filter.email")}
            trigger={trigger}
            name="email"
            type="email"
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          sx={{
            p: 0,
            m: 0
          }}
        >
          <CustomStaffInput control={control} rules={{}} label={t("filter.phone")} trigger={trigger} name="phone" />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          sx={{
            p: 0,
            m: 0
          }}
        >
          <CustomStaffInput control={control} rules={{}} label={t("filter.username")} trigger={trigger} name="username" />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          sx={{
            p: 0,
            m: 0
          }}
        >
          <CustomStaffInput control={control} rules={{}} label={t("filter.gender")} trigger={trigger} name="genders">
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
          </CustomStaffInput>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          sx={{
            p: 0,
            m: 0
          }}
        >
          <CustomStaffInput control={control} rules={{}} label={t("filter.status")} trigger={trigger} name="statuses">
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
          </CustomStaffInput>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          sx={{
            p: 0,
            m: 0
          }}
        >
          <CustomStaffInput control={control} rules={{}} label={t("filter.role")} trigger={trigger} name="roles">
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
          </CustomStaffInput>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          sx={{
            p: 0,
            m: 0
          }}
        >
          <CustomStaffInput control={control} rules={{}} label={t("filter.expertise")} trigger={trigger} name="expertise">
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
                    <Checkbox checked={watch().expertise?.indexOf(item?.id) > -1} />
                    <ListItemText primary={item?.name} />
                  </MenuItem>
                );
              })}
            </Select>
          </CustomStaffInput>
        </Grid>
      </Grid>
    );
  };

  const searchDebounce = useDebounce(watch().name, 1000);

  const loadData = async ({ page }) => {
    // console.log("Load: ");
    // const expertise = [];
    const paramsObj = {
      // ...watch()
      // name: watch().name,
      // from: watch().date,
      // to: watch().date,
      page,
      limit: watch().limit
    };
    if (!paramsObj.from) {
      delete paramsObj.from;
    }
    if (!paramsObj.to) {
      delete paramsObj.to;
    }

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
    const page = 1;
    const params = { ...watch(), page };

    const searchParams = qs.stringify(params);
    setValue("page", page);
    navigate(`?${searchParams}`);
    loadData({ page });
    // }, [watch().expertise, watch().type, watch().date]);
  }, [watch().limit]);

  useEffect(() => {
    const page = 1;
    const params = { ...watch(), page };
    const searchParams = qs.stringify(params);
    setValue("page", page);
    navigate(`?${searchParams}`);
    loadData({ page });
  }, [searchDebounce]);

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

  return isFetchConfigSuccess ? (
    <>
      <Box>
        <CustomOverlay open={isLoading} />
        <Typography variant="h4" component="h1" mb={2}>
          {t("title")}
        </Typography>

        {isMobile && <Button onClick={handleButtonClick}>{openFilterMobile ? t("hide_filter") : t("show_filter")}</Button>}
        <Collapse in={!isMobile || openFilterMobile}>{renderFilter()}</Collapse>

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
              reset();
            }}
            sx={{
              transform: "translateY(-25%)"
            }}
          >
            Reset
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

        {isMd ? (
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
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
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {staffs.map((staff) => {
                  return (
                    <TableRow key={staff?.id}>
                      <TableCell component="th" scope="row">
                        {staff?.username}
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          display: { lg: "table-cell" }
                        }}
                      >
                        {staff?.phoneNumber}
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          display: { lg: "table-cell" }
                        }}
                      >
                        {staff?.email}
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          display: { lg: "table-cell" }
                        }}
                      >
                        {staff?.name}
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          display: { lg: "table-cell", md: "none", sm: "none" }
                        }}
                      >
                        {staff?.address}
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          display: { lg: "table-cell", md: "none", sm: "none" }
                        }}
                      >
                        {staff?.gender}
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          display: { lg: "table-cell", md: "none", sm: "none" }
                        }}
                      >
                        {staff?.dob}
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          display: { lg: "table-cell" }
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
                          display: { lg: "table-cell" }
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
                          display: { lg: "table-cell" }
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
