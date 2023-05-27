import { Checkbox, Grid, ListItemText, MenuItem, Select } from "@mui/material";

import { useFormContext } from "react-hook-form";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAppConfigStore } from "../../store/AppConfigStore";
import CustomInput from "../../components/CustomInput";

function BookingFiltersForm() {
  const { locale } = useAppConfigStore();
  const { control, trigger, watch } = useFormContext();
  const { t: tFilter } = useTranslation("bookingPage", { keyPrefix: "bookingList.filter" });
  const { t: tSelect } = useTranslation("bookingPage", { keyPrefix: "bookingList.select" });

  const gridItemProps = {
    xs: 12,
    sm: 6,
    md: 4,
    lg: 3,
    sx: {
      p: 0,
      m: 0
    }
  };

  return (
    <Grid container spacing={{ xs: 2, md: 2 }} flexWrap="wrap" mb={4}>
      <Grid item {...gridItemProps}>
        <CustomInput control={control} rules={{}} label={tFilter("patient")} trigger={trigger} name="patient" type="text" />
      </Grid>
      <Grid item {...gridItemProps}>
        <CustomInput control={control} rules={{}} label={tFilter("doctor")} trigger={trigger} name="doctor" type="text" />
      </Grid>
      <Grid item {...gridItemProps}>
        <CustomInput control={control} rules={{}} label={tFilter("date")} trigger={trigger} name="date" type="date" />
      </Grid>
    </Grid>
  );
}
export default BookingFiltersForm;
