import PropTypes from "prop-types";
import { Box, Button, useTheme } from "@mui/material";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export const statisticsFilterTypes = {
  DAY: "Day",
  WEEK: "Week",
  MONTH: "Month",
  YEAR: "Year"
};

function StatisticsFilter({ time, setTime }) {
  const { t } = useTranslation("statisticsFeature", { keyPrefix: "StatisticsFilter" });

  const theme = useTheme();

  const buttons = useMemo(() => {
    return [
      {
        label: t("types.date"),
        value: statisticsFilterTypes.DATE
      },
      {
        label: t("types.week"),
        value: statisticsFilterTypes.WEEK
      },
      {
        label: t("types.month"),
        value: statisticsFilterTypes.MONTH
      },
      {
        label: t("types.year"),
        value: statisticsFilterTypes.YEAR
      }
    ];
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center"
      }}
    >
      {buttons.map((button) => {
        return (
          <Button
            sx={{
              backgroundColor: time === button.value ? theme.palette.success.light : theme.palette.secondary.light,
              color: time === button.value ? theme.palette.success.contrastText : theme.palette.secondary.contrastText,
              ml: 2
            }}
            key={button.value}
            onClick={() => {
              setTime(button.value);
            }}
            variant="contained"
          >
            {button.label}
          </Button>
        );
      })}
    </Box>
  );
}

StatisticsFilter.propTypes = {
  time: PropTypes.string.isRequired,
  setTime: PropTypes.func.isRequired
};

export default StatisticsFilter;
