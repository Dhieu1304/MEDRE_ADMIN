import PropTypes from "prop-types";
import { Box, Button, useTheme } from "@mui/material";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { statisticsFilterTypes } from "../../../entities/statistics";
import { useAppConfigStore } from "../../../store/AppConfigStore";

function StatisticsFilter({ time, setTime }) {
  const { t } = useTranslation("statisticsFeature", { keyPrefix: "StatisticsFilter" });
  const { locale } = useAppConfigStore();

  const theme = useTheme();

  const buttons = useMemo(() => {
    return [
      {
        label: t("types.day"),
        value: statisticsFilterTypes.DAY
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
  }, [locale]);

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
              backgroundColor: time === button.value ? theme.palette.success.light : "rgb(204, 204, 204)",
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
