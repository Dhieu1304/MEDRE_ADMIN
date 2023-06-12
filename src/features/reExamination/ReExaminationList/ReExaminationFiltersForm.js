import { Checkbox, Grid, ListItemText, MenuItem, Select } from "@mui/material";

import { useFormContext } from "react-hook-form";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAppConfigStore } from "../../../store/AppConfigStore";
import CustomInput from "../../../components/CustomInput";
import { patientGenders } from "../../../entities/Patient";

function PatientFiltersForm() {
  const { locale } = useAppConfigStore();
  const { control, trigger, watch } = useFormContext();

  const { t: tFilter } = useTranslation("patientFeature", { keyPrefix: "PatientList.filter" });
  const { t: tSelect } = useTranslation("patientFeature", { keyPrefix: "PatientList.select" });

  const patientGenderListObj = useMemo(() => {
    return [
      {
        label: tSelect("genders.male"),
        value: patientGenders.MALE
      },
      {
        label: tSelect("genders.female"),
        value: patientGenders.FEMALE
      },
      {
        label: tSelect("genders.other"),
        value: patientGenders.OTHER
      },
      {
        label: tSelect("genders.all"),
        value: ""
      }
    ].reduce((obj, cur) => {
      return {
        ...obj,
        [cur?.value]: cur
      };
    }, {});
  }, [locale]);

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
        <CustomInput control={control} rules={{}} label={tFilter("name")} trigger={trigger} name="name" type="text" />
      </Grid>
      <Grid item {...gridItemProps}>
        <CustomInput control={control} rules={{}} label={tFilter("phoneNumber")} trigger={trigger} name="phoneNumber" />
      </Grid>
      <Grid item {...gridItemProps}>
        <CustomInput control={control} rules={{}} label={tFilter("gender")} trigger={trigger} name="gender">
          <Select
            renderValue={(selected) => {
              return patientGenderListObj[selected].label;
            }}
          >
            {Object.keys(patientGenderListObj).map((key) => {
              const item = patientGenderListObj[key];

              return (
                <MenuItem key={item?.value} value={item?.value}>
                  <Checkbox checked={watch().gender === item?.value} />
                  <ListItemText primary={item?.label} />
                </MenuItem>
              );
            })}
          </Select>
        </CustomInput>
      </Grid>

      <Grid item {...gridItemProps}>
        <CustomInput control={control} rules={{}} label={tFilter("address")} trigger={trigger} name="address" type="text" />
      </Grid>

      <Grid item {...gridItemProps}>
        <CustomInput
          control={control}
          rules={{}}
          label={tFilter("healthInsurance")}
          trigger={trigger}
          name="healthInsurance"
          type="text"
        />
      </Grid>
    </Grid>
  );
}

export default PatientFiltersForm;
