import { useState } from "react";
import PropTypes from "prop-types";

import formatDate from "date-and-time";
import { Box, Button, InputAdornment, Menu } from "@mui/material";
import { CalendarToday as CalendarTodayIcon } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import CustomInput from "./CustomInput";

function CustomDateInput({ label, setDate, rules, date, render }) {
  const [showMenu, setShowMenu] = useState(null);

  const { control, trigger, handleSubmit } = useForm({
    mode: "onChange",
    defaultValues: {
      date
    },
    criteriaMode: "all"
  });

  const { t } = useTranslation("components", { keyPrefix: "CustomDateInput" });

  const handleFormDateSubmit = ({ date: newDate }) => {
    setDate(newDate);
    setShowMenu(null);
  };

  const renderDate = () => {
    if (render) return render();
    return formatDate.format(new Date(date), "DD/MM/YYYY");
  };

  return (
    <>
      <CustomInput
        label={label}
        noNameValue={renderDate(date)}
        type="text"
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
  rules: {},
  render: undefined
};

CustomDateInput.propTypes = {
  label: PropTypes.string.isRequired,
  setDate: PropTypes.func.isRequired,
  rules: PropTypes.object,
  date: PropTypes.string.isRequired,
  render: PropTypes.string
};

export default CustomDateInput;
