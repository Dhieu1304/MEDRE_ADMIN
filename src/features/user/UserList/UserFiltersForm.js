import { Checkbox, Grid, ListItemText, MenuItem, Select } from "@mui/material";

import { useFormContext } from "react-hook-form";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAppConfigStore } from "../../../store/AppConfigStore";
import CustomInput from "../../../components/CustomInput";
import { userGenders } from "../../../entities/User";

function UserFiltersForm() {
  const { locale } = useAppConfigStore();
  const { control, trigger, watch } = useFormContext();

  const { t: tFilter } = useTranslation("userFeature", { keyPrefix: "UserList.filter" });
  const { t: tSelect } = useTranslation("userFeature", { keyPrefix: "UserList.select" });

  const userGenderListObj = useMemo(() => {
    return [
      {
        label: tSelect("genders.male"),
        value: userGenders.MALE
      },
      {
        label: tSelect("genders.female"),
        value: userGenders.FEMALE
      },
      {
        label: tSelect("genders.other"),
        value: userGenders.OTHER
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

  const userStatusListObj = useMemo(() => {
    return [
      {
        label: tSelect("statuses.block"),
        value: true
      },
      {
        label: tSelect("statuses.unblock"),
        value: false
      },
      {
        label: tSelect("statuses.all"),
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
        <CustomInput control={control} rules={{}} label={tFilter("email")} trigger={trigger} name="email" type="email" />
      </Grid>
      <Grid item {...gridItemProps}>
        <CustomInput control={control} rules={{}} label={tFilter("phone")} trigger={trigger} name="phoneNumber" />
      </Grid>
      <Grid item {...gridItemProps}>
        <CustomInput control={control} rules={{}} label={tFilter("gender")} trigger={trigger} name="gender">
          <Select
            renderValue={(selected) => {
              return userGenderListObj[selected].label;
            }}
          >
            {Object.keys(userGenderListObj).map((key) => {
              const item = userGenderListObj[key];

              return (
                <MenuItem key={item?.value} value={item?.value}>
                  {/* role không lấy theo ID nên để
                          checked={watch("role")?.indexOf(item?.value) > -1}   */}
                  <Checkbox checked={watch().gender === item?.value} />
                  <ListItemText primary={item?.label} />
                </MenuItem>
              );
            })}
          </Select>
        </CustomInput>
      </Grid>
      <Grid item {...gridItemProps}>
        <CustomInput control={control} rules={{}} label={tFilter("status")} trigger={trigger} name="status">
          <Select
            renderValue={(selected) => {
              return userStatusListObj[selected].label;
            }}
          >
            {Object.keys(userStatusListObj).map((key) => {
              const item = userStatusListObj[key];
              return (
                <MenuItem key={item?.value} value={item?.value}>
                  {/* role không lấy theo ID nên để
                          checked={watch("role")?.indexOf(item?.value) > -1}   */}
                  <Checkbox checked={watch().status === item?.value} />
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

export default UserFiltersForm;
