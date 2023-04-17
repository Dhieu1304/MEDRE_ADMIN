import { Link, Route, Routes, useParams } from "react-router-dom";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import {
  CalendarMonth as CalendarMonthIcon,
  Info as InfoIcon,
  Schedule as ScheduleIcon,
  TimerOff as TimerOffIcon
} from "@mui/icons-material";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { staffDetailRoutes } from "./routes";
import { StaffDetail } from "../../features/staff";
import { DoctorScheduleCalendar, DoctorTimeOff } from "../../features/schedule";
import routeConfig from "../../config/routeConfig";

function StaffDetailPage() {
  const params = useParams();
  const staffId = useMemo(() => params?.staffId, [params?.staffId]);
  const [value, setValue] = useState(0);

  const path = `${routeConfig.staff}/${staffId}`;

  const { t } = useTranslation("staffPage", {
    keyPrefix: "StaffDetailPage"
  });

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
          label={renderTableLabel("tabs.info")}
          icon={<InfoIcon />}
          iconPosition="start"
          LinkComponent={Link}
          to={path + staffDetailRoutes.detail}
        />
        <Tab
          label={renderTableLabel("tabs.schedule")}
          icon={<CalendarMonthIcon />}
          iconPosition="start"
          LinkComponent={Link}
          to={path + staffDetailRoutes.calendar}
        />
        <Tab
          label={renderTableLabel("tabs.schedule")}
          icon={<ScheduleIcon />}
          iconPosition="start"
          LinkComponent={Link}
          to={path + staffDetailRoutes.schedule}
        />
        <Tab
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
          <Route path={staffDetailRoutes.schedule} element={<DoctorScheduleCalendar staffId={staffId} />} />
          <Route path={staffDetailRoutes.timeOff} element={<DoctorTimeOff staffId={staffId} />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default StaffDetailPage;
