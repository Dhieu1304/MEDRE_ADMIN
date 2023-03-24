import React, { useMemo, useState } from "react";

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
  // ListItemText,
  // Checkbox,
  // MenuItem,
  Grid,
  // Select,
  useMediaQuery,
  Collapse,
  Button,
  TablePagination
} from "@mui/material";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import CustomStaffInput from "./components/CustomStaffInput";

const columns = [
  { id: "username", label: "Username", minWidth: 100 },
  { id: "phone_number", label: "Phone Number", minWidth: 100 },
  { id: "email", label: "Email", minWidth: 150 },
  { id: "name", label: "Name", minWidth: 100 },
  { id: "image", label: "Image", minWidth: 100 },
  { id: "address", label: "Address", minWidth: 150 },
  { id: "gender", label: "Gender", minWidth: 50 },
  { id: "dob", label: "Date of Birth", minWidth: 100 },
  { id: "role", label: "Role", minWidth: 100 },
  { id: "status", label: "Status", minWidth: 50 }
  // { id: "description", label: "Description", minWidth: 150 },
  // { id: "education", label: "Education", minWidth: 100 },
  // { id: "certificate", label: "Certificate", minWidth: 100 }
];

const rows = [
  {
    id: 1,
    username: "johndoe",
    phone_number: "123-456-7890",
    email: "johndoe@gmail.com",
    name: "John Doe",
    image: "https://via.placeholder.com/150",
    address: "123 Main St, Anytown, USA",
    gender: "Male",
    dob: "01/01/1980",
    role: "Manager",
    status: "Active",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    education: "Bachelor of Science in Computer Science",
    certificate: "Certified Scrum Master"
  },
  {
    id: 2,
    username: "janedoe",
    phone_number: "555-555-5555",
    email: "janedoe@gmail.com",
    name: "Jane Doe",
    image: "https://via.placeholder.com/150",
    address: "456 Main St, Anytown, USA",
    gender: "Female",
    dob: "02/02/1985",
    role: "Developer",
    status: "Inactive",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    education: "Master of Science in Computer Science",
    certificate: "AWS Certified Solutions Architect"
  }
];

export default function StaffList() {
  // const doctorTypesList = useMemo(() => {
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

  const [count, setCount] = useState(10);

  const [openFilterMobile, setOpenFilterMobile] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)"); // adjust breakpoint to your needs

  const handleButtonClick = () => {
    setOpenFilterMobile(!openFilterMobile);
  };

  const location = useLocation();

  const defaultValues = useMemo(() => {
    const defaultSearchParams = qs.parse(location.search);

    const { search, type, date, expertise, page, limit } = defaultSearchParams;

    return {
      search: search || "",
      type: Array.isArray(type) ? type : [],
      // date: date || formatDate.format(new Date(2023, 2, 12), "YYYY-MM-DD"),
      date,
      // from: from || formatDate.format(new Date(2023, 2, 12), "YYYY-MM-DD"),
      // to: formatDate.format(new Date(2023, 2, 14), "YYYY-MM-DD"),
      expertise: Array.isArray(expertise) ? expertise : [],
      page: parseInt(page, 10) || 1,
      limit: limit || 1
    };
  }, []);

  const { control, trigger, watch, setValue } = useForm({
    mode: "onChange",
    defaultValues,
    criteriaMode: "all"
  });

  const { t } = useTranslation("staffFeature", { keyPrefix: "staff_list" });

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
            name="search"
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
          <CustomStaffInput control={control} rules={{}} label={t("filter.gender")} trigger={trigger} name="gender" />
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
          <CustomStaffInput control={control} rules={{}} label={t("filter.status")} trigger={trigger} name="status" />
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
          <CustomStaffInput control={control} rules={{}} label={t("filter.role")} trigger={trigger} name="role" />
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
          <CustomStaffInput control={control} rules={{}} label={t("filter.expertise")} trigger={trigger} name="expertise" />
        </Grid>
      </Grid>
    );
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" mb={2}>
        Tìm kiếm nhân viên
      </Typography>
      <Link to="/staff/1">Link</Link>

      {isMobile && <Button onClick={handleButtonClick}>{openFilterMobile ? t("hide_filter") : t("show_filter")}</Button>}
      <Collapse in={!isMobile || openFilterMobile}>{renderFilter()}</Collapse>
      <TablePagination
        component="div"
        count={Math.ceil(count / watch().limit)}
        page={watch().page}
        onPageChange={(e, newPage) => {
          setValue("page", newPage);
          // loadData({ page: newPage });
        }}
        rowsPerPage={watch().limit}
        onRowsPerPageChange={(e) => {
          const newLimit = parseInt(e.target.value, 10);
          setValue("limit", newLimit);
          setCount(count);
          // loadData({ page: newPage });
        }}
        sx={{
          mb: 2
        }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align="left" style={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              return (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    {row.username}
                  </TableCell>
                  <TableCell align="left">{row.phone_number}</TableCell>
                  <TableCell align="left">{row.email}</TableCell>
                  <TableCell align="left">{row.name}</TableCell>
                  <TableCell align="left">{row.image}</TableCell>
                  <TableCell align="left">{row.address}</TableCell>
                  <TableCell align="left">{row.gender}</TableCell>
                  <TableCell align="left">{row.dob}</TableCell>
                  <TableCell align="left">{row.role}</TableCell>
                  <TableCell align="left">{row.status}</TableCell>
                  {/* <TableCell align="left">{row.description}</TableCell>
                  <TableCell align="left">{row.education}</TableCell>
                  <TableCell align="left">{row.certificate}</TableCell> */}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
