import { useEffect, useMemo, useState } from "react";
import formatDate from "date-and-time";
import { Box, Button, Grid, InputAdornment, Menu, Switch, Typography } from "@mui/material";
import { CalendarToday as CalendarTodayIcon } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import CustomInput from "./CustomInput";

function CustomDateInput({ label, setDate, rules, date }) {
  const [showMenu, setShowMenu] = useState(null);

  const { control, trigger, handleSubmit } = useForm({
    mode: "onChange",
    defaultValues: {
      date
    },
    criteriaMode: "all"
  });

  const { t } = useTranslation("components", { keyPrefix: "CustomDateInput" });

  const handleFormDateSubmit = ({ date }) => {
    setDate(date);
    setShowMenu(null);
  };

  return (
    <>
      <CustomInput
        label={label}
        noNameValue={date}
        type="date"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <CalendarTodayIcon
                sx={{
                  cursor: "pointer"
                }}
                onClick={(event) => {
                  setShowMenu(event.currentTarget);
                }}
              />
            </InputAdornment>
          )
        }}
      />
      <Menu
        anchorEl={showMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        open={Boolean(showMenu)}
        onClose={() => {
          setShowMenu(null);
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 2,
            width: 250
          }}
        >
          <CustomInput control={control} rules={{ ...rules }} label={label} trigger={trigger} name="date" type="date" />

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 2
            }}
          >
            <Button variant="contained" onClick={handleSubmit(handleFormDateSubmit)}>
              {t("button.submit")}
            </Button>
          </Box>
        </Box>
      </Menu>
    </>
  );
}

CustomDateInput.defaultProps = {
  // label: "",
  // fromDateRules: {},
  // toDateRules: {},
  // fromDateLabel: "",
  // toDateLabel: "",
  // haveTime: undefined
};

CustomDateInput.propTypes = {
  // label: PropTypes.string,
  // watchMainForm: PropTypes.func.isRequired,
  // setMainFormValue: PropTypes.func.isRequired,
  // fromDateName: PropTypes.string.isRequired,
  // fromDateRules: PropTypes.object,
  // toDateName: PropTypes.string.isRequired,
  // toDateRules: PropTypes.object,
  // fromDateLabel: PropTypes.string,
  // toDateLabel: PropTypes.string,
  // haveTime: PropTypes.bool
};

export default CustomDateInput;
