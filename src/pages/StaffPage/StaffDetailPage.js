import { Link, Route, Routes, useLocation, useParams } from "react-router-dom";
import { Box, Tab, Tabs } from "@mui/material";
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
import { useAppConfigStore } from "../../store/AppConfigStore";

const tabTypes = {
  INFO: "INFO",
  CALENDAR: "CALENDAR",
  SCHEDULE: "SCHEDULE",
  TIMEOFF: "TIMEOFF"
};

function StaffDetailPage() {
  const params = useParams();
  const staffId = useMemo(() => params?.staffId, [params?.staffId]);
  const [value, setValue] = useState(tabTypes.INFO);

  const path = `${routeConfig.staff}/${staffId}`;

  const { t } = useTranslation("staffPage", {
    keyPrefix: "StaffDetailPage"
  });

  const location = useLocation();
  const { locale } = useAppConfigStore();

  const tabs = useMemo(() => {
    const tabList = [
      {
        value: tabTypes.INFO,
        label: t("tabs.info"),
        icon: <InfoIcon />,
        to: `${path}${staffDetailRoutes.detail}`
      },
      {
        value: tabTypes.CALENDAR,
        label: t("tabs.calendar"),
        icon: <CalendarMonthIcon />,
        to: `${path}${staffDetailRoutes.calendar}`
      },
      {
        value: tabTypes.SCHEDULE,
        label: t("tabs.schedule"),
        icon: <ScheduleIcon />,
        to: `${path}${staffDetailRoutes.schedule}`
      },
      {
        value: tabTypes.TIMEOFF,
        label: t("tabs.timeOff"),
        icon: <TimerOffIcon />,
        to: `${path}${staffDetailRoutes.timeOff}`
      }
    ];
    return tabList;
  }, [locale]);

  useEffect(() => {
    const currentPath = location.pathname;
    // console.log("currentPath: ", currentPath);
    switch (currentPath) {
      case path + staffDetailRoutes.calendar:
        setValue(tabTypes.CALENDAR);
        break;
      case path + staffDetailRoutes.schedule:
        setValue(tabTypes.SCHEDULE);
        break;
      case path + staffDetailRoutes.timeOff:
        setValue(tabTypes.TIMEOFF);
        break;
      case path + staffDetailRoutes.detail:
      default:
        setValue(tabTypes.INFO);
        break;
    }
  }, [location]);

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
        {tabs?.map((tab) => {
          return (
            <Tab
              key={tab?.value}
              value={tab?.value}
              label={tab?.label}
              icon={tab?.icon}
              iconPosition="start"
              LinkComponent={Link}
              to={tab?.to}
            />
          );
        })}
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
