import { Link, Route, Routes, useLocation, useParams } from "react-router-dom";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import {
  CalendarMonth as CalendarMonthIcon,
  Info as InfoIcon,
  Schedule as ScheduleIcon,
  TimerOff as TimerOffIcon
} from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { staffDetailRoutes } from "./routes";
import { StaffDetail } from "../../features/staff";
import { DoctorScheduleCalendar, DoctorScheduleList, DoctorTimeOff } from "../../features/schedule";
import routeConfig from "../../config/routeConfig";

function StaffDetailPage() {
  const params = useParams();
  const staffId = useMemo(() => params?.staffId, [params?.staffId]);
  const [value, setValue] = useState(0);

  const path = `${routeConfig.staff}/${staffId}`;

  const { t } = useTranslation("staffPage", {
    keyPrefix: "StaffDetailPage"
  });

  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    // console.log("currentPath: ", currentPath);
    switch (currentPath) {
      case path + staffDetailRoutes.calendar:
        setValue(1);
        break;
      case path + staffDetailRoutes.schedule:
        setValue(2);
        break;
      case path + staffDetailRoutes.timeOff:
        setValue(3);
        break;
      case path + staffDetailRoutes.detail:
      default:
        setValue(0);
        break;
    }
  }, [location]);

  const renderTableLabel = (label) => {
    return (
      <Typography
        sx={{
          display: { xs: "none", md: "block" }
        }}
      >
        {t(label)}
      </Typography>
    );
  };

  return (
    <Box
      sx={{
        position: "relative"
      }}
    >
      <Tabs
        value={value}
        onChange={(e, newValue) => {
          // console.log("newValue: ", newValue);
          setValue(newValue);
        }}
        sx={{
          mb: 2,
          mt: 0,
          position: "absolute",
          top: 0,
          left: 0,
          transform: "translateY(-40%)"
        }}
      >
        <Tab
          value={0}
          label={renderTableLabel("tabs.info")}
          icon={<InfoIcon />}
          iconPosition="start"
          LinkComponent={Link}
          to={path + staffDetailRoutes.detail}
        />
        <Tab
          value={1}
          label={renderTableLabel("tabs.calendar")}
          icon={<CalendarMonthIcon />}
          iconPosition="start"
          LinkComponent={Link}
          to={path + staffDetailRoutes.calendar}
        />
        <Tab
          value={2}
          label={renderTableLabel("tabs.schedule")}
          icon={<ScheduleIcon />}
          iconPosition="start"
          LinkComponent={Link}
          to={path + staffDetailRoutes.schedule}
        />

        <Tab
          value={3}
          label={renderTableLabel("tabs.timeOff")}
          icon={<TimerOffIcon />}
          iconPosition="start"
          LinkComponent={Link}
          to={path + staffDetailRoutes.timeOff}
        />
      </Tabs>
      <Box
        sx={{
          py: 10
        }}
      >
        <Routes>
          <Route path={staffDetailRoutes.detail} element={<StaffDetail staffId={staffId} />} />
          <Route path={staffDetailRoutes.calendar} element={<DoctorScheduleCalendar staffId={staffId} />} />
          <Route path={staffDetailRoutes.schedule} element={<DoctorScheduleList staffId={staffId} />} />
          <Route path={staffDetailRoutes.timeOff} element={<DoctorTimeOff staffId={staffId} />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default StaffDetailPage;
