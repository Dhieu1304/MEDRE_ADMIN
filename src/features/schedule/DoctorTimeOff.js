import { useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  useTheme
} from "@mui/material";
import formatDate from "date-and-time";
import { useTranslation } from "react-i18next";
import { Add as AddIcon, Edit as EditIcon, RemoveCircle } from "@mui/icons-material";
import qs from "query-string";

import PropTypes from "prop-types";
// import WithDoctorLoaderWrapper from "../staff/hocs/WithDoctorLoaderWrapper";
import { subject } from "@casl/ability";
import { useLocation, useNavigate } from "react-router-dom";
import { useFetchingStore } from "../../store/FetchingApiStore";
import { normalizeStrToDateStr, normalizeStrToInt } from "../../utils/standardizedForForm";
import { formatDateLocale, getWeekByDate } from "../../utils/datetimeUtil";
import { CustomDateFromToInput } from "../../components/CustomInput";
import timeOffServices from "../../services/timeOffServices";
import { useAppConfigStore } from "../../store/AppConfigStore";
import AddNewTimeOffModal from "./components/AddNewTimeOffModal";
import { useCustomModal } from "../../components/CustomModal";
import { useTimeOffSessionsContantTranslation } from "./hooks/useTimeOffConstantsTranslation";
import CustomPageTitle from "../../components/CustomPageTitle";
import { staffActionAbility } from "../../entities/Staff";
// import Staff from "../../entities/Staff/Staff";
import { Can } from "../../store/AbilityStore";
import EditTimeOffModal from "./components/EditTimeOffModal";
import DeleteTimeOffModal from "./components/DeleteTimeOffModal";
import StaffInfoCard from "../../components/StaffInfoCard";
import entities from "../../entities/entities";

const createDefaultValues = ({ from, to, page, limit } = {}) => {
  const week = getWeekByDate();
  const result = {
    from: normalizeStrToDateStr(from, week[0]),
    to: normalizeStrToDateStr(to, week[6]),
    page: normalizeStrToInt(page, 1),
    limit: normalizeStrToInt(limit, 10)
  };

  return result;
};

function DoctorTimeOff({ staff }) {
  const [timeOffs, setTimeOffs] = useState([]);
  const [count, setCount] = useState(0);

  const theme = useTheme();

  const location = useLocation();
  const defaultValues = useMemo(() => {
    const defaultSearchParams = qs.parse(location.search);
    const result = createDefaultValues(defaultSearchParams);
    return result;
  }, []);

  const { watch, setValue } = useForm({
    mode: "onChange",
    defaultValues,
    criteriaMode: "all"
  });

  const { fetchApi } = useFetchingStore();
  const { locale } = useAppConfigStore();

  const { t } = useTranslation("scheduleFeature", { keyPrefix: "DoctorTimeOff" });
  const { t: tTimeOff } = useTranslation("timeOffEntity", { keyPrefix: "properties" });
  const [, timeOffSessionContantListObj] = useTimeOffSessionsContantTranslation();

  const addTimeOffModal = useCustomModal();
  const editTimeOffModal = useCustomModal();
  const navigate = useNavigate();
  const deleteTimeOffModal = useCustomModal();

  const columns = useMemo(
    () => [
      {
        id: "date",
        label: tTimeOff("date"),
        minWidth: 100
      },
      {
        id: "session",
        label: tTimeOff("session"),
        minWidth: 100
      },
      {
        id: "action",
        label: "",
        minWidth: 100
      }
    ],
    [locale]
  );

  const loadData = async ({ page }) => {
    const paramsObj = {
      ...watch(),
      page
    };

    // console.log("loadData ");

    await fetchApi(
      async () => {
        const staffId = staff?.id;
        const res = await timeOffServices.getTimeOffByDoctorId(staffId, paramsObj);
        let countData = 0;
        let timeOffsData = [];
        // console.log("res: ", res);
        if (res.success) {
          timeOffsData = res?.timeOffs || [];
          countData = res?.count;
          // console.log("timeOffsData ", timeOffsData);
          setTimeOffs(timeOffsData);
          setCount(countData);
          return { ...res };
        }
        setTimeOffs([]);
        setCount(0);
        return { ...res };
      },
      { hideSuccessToast: true }
    );
  };

  useEffect(() => {
    const page = 1;
    loadData({ page });

    const params = { ...watch(), page };
    const searchParams = qs.stringify(params);
    setValue("page", page);
    navigate(`?${searchParams}`);
  }, [watch().from, watch().to, watch().limit]);

  useMemo(() => {
    const code = locale?.slice(0, 2) || "vi";
    formatDate.locale(formatDateLocale[code]);
  }, [locale]);

  const handleAfterAddTimeOff = async () => {
    await loadData({ page: 1 });
  };

  const handleAfterEditTimeOff = async () => {
    await loadData({ page: 1 });
  };

  const handleAfterDeleteTimeOff = async () => {
    await loadData({ page: 1 });
  };

  return (
    <>
      <Box>
        <CustomPageTitle
          title={t("title")}
          right={
            <Can I={staffActionAbility.ADD_DOCTOR_TIMEOFF} a={subject(entities.STAFF, staff)}>
              <Button
                variant="contained"
                onClick={() => {
                  addTimeOffModal.setShow(true);
                  addTimeOffModal.setData(staff);
                }}
                endIcon={<AddIcon fontSize="large" />}
                sx={{
                  bgcolor: theme.palette.success.light
                }}
              >
                {t("button.addTimeOff")}
              </Button>
            </Can>
          }
        />

        {staff && staff?.id && <StaffInfoCard staff={staff} />}

        <Grid container spacing={3} justifyContent="space-between">
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <CustomDateFromToInput
              watchMainForm={watch}
              setMainFormValue={setValue}
              label={t("filter.dateRange")}
              fromDateName="from"
              fromDateRules={{}}
              toDateName="to"
              toDateRules={{}}
              fromDateLabel={tTimeOff("from")}
              toDateLabel={tTimeOff("to")}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={4}>
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
          </Grid>
        </Grid>

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
                        fontWeight: 600
                      }}
                    >
                      {column.label}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {timeOffs.map((timeOff) => {
                return (
                  <TableRow key={timeOff?.id}>
                    <TableCell component="th" scope="row" sx={{ display: "table-cell" }}>
                      {formatDate.format(new Date(timeOff?.from), "ddd DD/MM/YYYY")} &rarr;{" "}
                      {formatDate.format(new Date(timeOff?.to), "ddd DD/MM/YYYY")}
                    </TableCell>
                    <TableCell align="left" sx={{ display: "table-cell" }}>
                      {timeOffSessionContantListObj[timeOff?.session]?.label}
                    </TableCell>

                    <TableCell align="left" sx={{ display: "table-cell" }}>
                      <Box
                        sx={{
                          display: "flex-end",
                          alignItems: "center"
                        }}
                      >
                        <Can I={staffActionAbility.UPDATE_DOCTOR_TIMEOFF} a={subject(entities.STAFF, staff)}>
                          <EditIcon
                            sx={{ mx: 1, color: theme.palette.success.light, cursor: "pointer" }}
                            onClick={() => {
                              editTimeOffModal.setShow(true);
                              editTimeOffModal.setData(timeOff);
                            }}
                          />
                        </Can>
                        <Can I={staffActionAbility.DELETE_DOCTOR_TIMEOFF} a={subject(entities.STAFF, staff)}>
                          <RemoveCircle
                            sx={{ mx: 1, color: theme.palette.error.light, cursor: "pointer" }}
                            onClick={() => {
                              deleteTimeOffModal.setShow(true);
                              deleteTimeOffModal.setData(timeOff);
                            }}
                          />
                        </Can>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

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

      {addTimeOffModal.show && (
        <AddNewTimeOffModal
          show={addTimeOffModal.show}
          setShow={addTimeOffModal.setShow}
          data={addTimeOffModal.data}
          setData={addTimeOffModal.setData}
          handleAfterAddTimeOff={handleAfterAddTimeOff}
        />
      )}

      {editTimeOffModal.show && (
        <EditTimeOffModal
          show={editTimeOffModal.show}
          setShow={editTimeOffModal.setShow}
          data={editTimeOffModal.data}
          setData={editTimeOffModal.setData}
          handleAfterEditTimeOff={handleAfterEditTimeOff}
        />
      )}

      {deleteTimeOffModal.show && (
        <DeleteTimeOffModal
          show={deleteTimeOffModal.show}
          setShow={deleteTimeOffModal.setShow}
          data={deleteTimeOffModal.data}
          setData={deleteTimeOffModal.setData}
          handleAfterDeleteTimeOff={handleAfterDeleteTimeOff}
        />
      )}
    </>
  );
}

DoctorTimeOff.propTypes = {
  staff: PropTypes.object.isRequired
};

export default DoctorTimeOff;

// const DoctorTimeOff = () => {
//   return <div>DoctorTimeOff</div>;
// };

// export default DoctorTimeOff;
