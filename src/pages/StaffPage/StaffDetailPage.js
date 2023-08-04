import { Link, Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
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
import { useFetchingStore } from "../../store/FetchingApiStore";
import staffServices from "../../services/staffServices";
import { staffRoles } from "../../entities/Staff";
import CustomOverlay from "../../components/CustomOverlay/CustomOverlay";

const tabTypes = {
  INFO: "INFO",
  CALENDAR: "CALENDAR",
  SCHEDULE: "SCHEDULE",
  TIMEOFF: "TIMEOFF"
};

function StaffDetailPage() {
  const params = useParams();
  const staffId = useMemo(() => params?.staffId, [params?.staffId]);
  const [staff, setStaff] = useState();
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

  const { isLoading, fetchApi } = useFetchingStore();
  const loadData = async () => {
    await fetchApi(
      async () => {
        const res = await staffServices.getStaffDetail(staffId);
        if (res.success) {
          const staffData = { ...res.staff };
          setStaff(staffData);
          return { ...res };
        }
        setStaff({});
        return { ...res };
      },
      { hideSuccessToast: true }
    );
  };
  useEffect(() => {
    if (staffId) {
      loadData();
    }
  }, [staffId]);

  useEffect(() => {
    if (staff && staff?.role === staffRoles.ROLE_DOCTOR) {
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
    }
  }, [location, staff]);

  // console.log("staff?.role:", staff?.role);
  if (staff && staff?.id) {
    return staff?.role === staffRoles.ROLE_DOCTOR ? (
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
            <Route path={staffDetailRoutes.detail} element={<StaffDetail staff={staff} loadData={loadData} />} />
            <Route path={staffDetailRoutes.calendar} element={<DoctorScheduleCalendar staff={staff} />} />
            <Route path={staffDetailRoutes.schedule} element={<DoctorScheduleList staff={staff} />} />
            <Route path={staffDetailRoutes.timeOff} element={<DoctorTimeOff staff={staff} />} />
          </Routes>
        </Box>
      </Box>
    ) : (
      <Routes>
        <Route path={staffDetailRoutes.detail} element={<StaffDetail staff={staff} loadData={loadData} />} />
        <Route path={staffDetailRoutes.default} element={<Navigate to={routeConfig.home} replace />} />
      </Routes>
    );
  }
  return <CustomOverlay open={isLoading} />;
}

export default StaffDetailPage;
