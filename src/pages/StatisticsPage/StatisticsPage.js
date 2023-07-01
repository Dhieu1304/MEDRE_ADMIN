import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";

import { Group as GroupIcon, Payment, Person, Schedule as ScheduleIcon } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import routeConfig from "../../config/routeConfig";
import { statisticsRoutes } from "./routes";
import { BookingStatistics, PatientStatistics, RevenueStatistics, UserStatistics } from "../../features/statistics";

export default function StatisticsPage() {
  const [value, setValue] = useState(statisticsRoutes.booking);
  // const params = useParams();

  const path = `${routeConfig.statistics}`;
  const { t } = useTranslation("statisticsPage", {
    keyPrefix: "StatisticsPage"
  });

  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    switch (currentPath) {
      case path + statisticsRoutes.user:
        setValue(statisticsRoutes.user);
        break;

      case path + statisticsRoutes.patient:
        setValue(statisticsRoutes.patient);
        break;

      case path + statisticsRoutes.revenue:
        setValue(statisticsRoutes.revenue);
        break;

      case path + statisticsRoutes.booking:
      default:
        setValue(statisticsRoutes.booking);
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
          value={statisticsRoutes.booking}
          label={renderTableLabel("tabs.booking")}
          icon={<ScheduleIcon />}
          iconPosition="start"
          LinkComponent={Link}
          to={path + statisticsRoutes.booking}
        />
        <Tab
          value={statisticsRoutes.user}
          label={renderTableLabel("tabs.user")}
          icon={<GroupIcon />}
          iconPosition="start"
          LinkComponent={Link}
          to={path + statisticsRoutes.user}
        />

        <Tab
          value={statisticsRoutes.patient}
          label={renderTableLabel("tabs.patient")}
          icon={<Person />}
          iconPosition="start"
          LinkComponent={Link}
          to={path + statisticsRoutes.patient}
        />
        <Tab
          value={statisticsRoutes.revenue}
          label={renderTableLabel("tabs.revenue")}
          icon={<Payment />}
          iconPosition="start"
          LinkComponent={Link}
          to={path + statisticsRoutes.revenue}
        />
      </Tabs>
      <Box
        sx={{
          py: 10
        }}
      >
        <Routes>
          <Route path="/" element={<Navigate to={`${routeConfig.statistics}${statisticsRoutes.booking}`} replace />} />
          <Route path={statisticsRoutes.booking} element={<BookingStatistics />} />
          <Route path={statisticsRoutes.user} element={<UserStatistics />} />
          <Route path={statisticsRoutes.patient} element={<PatientStatistics />} />
          <Route path={statisticsRoutes.revenue} element={<RevenueStatistics />} />
        </Routes>
      </Box>
    </Box>
  );
}
