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
  Typography
} from "@mui/material";
import formatDate from "date-and-time";
import { useTranslation } from "react-i18next";
import { Add as AddIcon } from "@mui/icons-material";
import { useTheme } from "@emotion/react";
import PropTypes from "prop-types";
import WithDoctorLoaderWrapper from "../staff/hocs/WithDoctorLoaderWrapper";
import { useFetchingStore } from "../../store/FetchingApiStore";
import { normalizeStrToDateStr } from "../../utils/standardizedForForm";
import { getWeekByDate } from "../../utils/datetimeUtil";
import { CustomDateFromToInput } from "../../components/CustomInput";
import timeOffServices from "../../services/timeOffServices";
import { useAppConfigStore } from "../../store/AppConfigStore";
import AddNewTimeOffModal from "./components/AddNewTimeOffModal";
import { useCustomModal } from "../../components/CustomModal";

function DoctorTimeOff({ doctor, doctorId }) {
  const [timeOffs, setTimeOffs] = useState([]);
  const [count, setCount] = useState(0);

  const theme = useTheme();

  const week = useMemo(() => {
    return getWeekByDate();
  }, []);

  const { watch, setValue } = useForm({
    mode: "onChange",
    defaultValues: {
      from: normalizeStrToDateStr(week[0]),
      to: normalizeStrToDateStr(week[6]),
      page: 1,
      limit: 10
    },
    criteriaMode: "all"
  });

  const { fetchApi } = useFetchingStore();
  const { locale } = useAppConfigStore();

  const { t } = useTranslation("scheduleFeature", { keyPrefix: "DoctorTimeOff" });
  const { t: tTimeOff } = useTranslation("timeOffEntity", { keyPrefix: "properties" });

  const addTimeOffModal = useCustomModal();

  const columns = useMemo(
    () => [
      {
        id: "date",
        label: tTimeOff("date"),
        minWidth: 100
      },
      {
        id: "time",
        label: tTimeOff("time"),
        minWidth: 100
      },
      {
        id: "createdAt",
        label: tTimeOff("createdAt"),
        minWidth: 100
      },
      {
        id: "updatedAt",
        label: tTimeOff("updatedAt"),
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

    await fetchApi(async () => {
      const res = await timeOffServices.getTimeOffByDoctorId(doctorId, paramsObj);
      let countData = 0;
      let timeOffsData = [];
      // console.log("res: ", res);
      if (res.success) {
        timeOffsData = res?.timeOffs || [];
        countData = res?.count;
        setTimeOffs(timeOffsData);
        setCount(countData);
        return { success: true };
      }
      setTimeOffs([]);
      setCount(0);
      return { error: res.message };
    });
  };

  useEffect(() => {
    const page = 1;
    loadData({ page });
  }, [watch().from, watch().to]);

  const handleAfterAddTimeOff = async () => {
    await loadData({ page: 1 });
  };

  return (
    <>
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <Typography variant="h4" sx={{ mb: 4 }}>
            {t("title")}
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              addTimeOffModal.setShow(true);
              addTimeOffModal.setData(doctor);
            }}
            endIcon={<AddIcon fontSize="large" />}
            sx={{
              bgcolor: theme.palette.success.light
            }}
          >
            {t("button.addTimeOff")}
          </Button>
        </Box>
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
              fromDateLabel="From"
              toDateLabel="To"
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
                      {formatDate.format(new Date(timeOff?.date), "DD/MM/YYYY")}
                    </TableCell>
                    <TableCell align="left" sx={{ display: "table-cell" }}>
                      {timeOff?.timeStart} &rarr; {timeOff?.timeEnd}
                    </TableCell>
                    <TableCell align="left" sx={{ display: "table-cell" }}>
                      {formatDate.format(new Date(timeOff?.createdAt), "DD/MM/YYYY hh:mm:ss")}
                    </TableCell>
                    <TableCell align="left" sx={{ display: "table-cell" }}>
                      {formatDate.format(new Date(timeOff?.updatedAt), "DD/MM/YYYY hh:mm:ss")}
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
    </>
  );
}

DoctorTimeOff.propTypes = {
  doctor: PropTypes.object.isRequired,
  doctorId: PropTypes.string.isRequired
};

export default WithDoctorLoaderWrapper(DoctorTimeOff);

// const DoctorTimeOff = () => {
//   return <div>DoctorTimeOff</div>;
// };

// export default DoctorTimeOff;
