import { Link, Route, Routes, useLocation } from "react-router-dom";

import { Group as GroupIcon, Schedule as ScheduleIcon } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import routeConfig from "../../config/routeConfig";
import { statisticsRoutes } from "./routes";
import { BookingStatistics, UserStatistics } from "../../features/statistics";

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
      </Tabs>
      <Box
        sx={{
          py: 10
        }}
      >
        <Routes>
          <Route path={statisticsRoutes.booking} element={<BookingStatistics />} />
          <Route path={statisticsRoutes.user} element={<UserStatistics />} />
        </Routes>
      </Box>
    </Box>
  );
}
