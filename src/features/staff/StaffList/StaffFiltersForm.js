import { Checkbox, Grid, ListItemText, MenuItem, Select } from "@mui/material";

import PropTypes from "prop-types";

import { useFormContext } from "react-hook-form";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAppConfigStore } from "../../../store/AppConfigStore";
import CustomInput, { CustomDateFromToInput } from "../../../components/CustomInput";
import { staffGenders, staffRoles } from "../../../entities/Staff";

function StaffFiltersForm({ expertisesList }) {
  const { locale } = useAppConfigStore();
  const { control, trigger, watch, setValue } = useFormContext();

  const { t: tFilter } = useTranslation("staffFeature", { keyPrefix: "StaffList.filter" });
  const { t: tSelect } = useTranslation("staffFeature", { keyPrefix: "StaffList.select" });

  const staffRoleListObj = useMemo(() => {
    const staffRoleList = [
      {
        label: tSelect("roles.admin"),
        value: staffRoles.ROLE_ADMIN
      },
      {
        label: tSelect("roles.doctor"),
        value: staffRoles.ROLE_DOCTOR
      },
      {
        label: tSelect("roles.nurse"),
        value: staffRoles.ROLE_NURSE
      },
      {
        label: tSelect("roles.customerService"),
        value: staffRoles.ROLE_CUSTOMER_SERVICE
      },
      {
        label: tSelect("roles.all"),
        value: ""
      }
    ];

    return staffRoleList.reduce((obj, cur) => {
      return {
        ...obj,
        [cur?.value]: cur
      };
    }, {});
  }, [locale]);

  const staffGenderListObj = useMemo(() => {
    return [
      {
        label: tSelect("genders.male"),
        value: staffGenders.MALE
      },
      {
        label: tSelect("genders.female"),
        value: staffGenders.FEMALE
      },
      {
        label: tSelect("genders.other"),
        value: staffGenders.OTHER
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

  const staffTypeListObj = useMemo(() => {
    return [
      {
        label: tSelect("types.offline"),
        value: "Offline"
      },
      {
        label: tSelect("types.online"),
        value: "Online"
      },
      {
        label: tSelect("types.all"),
        value: ""
      }
    ].reduce((obj, cur) => {
      return {
        ...obj,
        [cur?.value]: cur
      };
    }, {});
  }, [locale]);

  const staffStatusListObj = useMemo(() => {
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

  const expertiseListObj = useMemo(() => {
    return expertisesList.reduce((obj, cur) => {
      return {
        ...obj,
        [cur?.id]: cur
      };
    }, {});
  }, [expertisesList]);

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
        <CustomInput control={control} rules={{}} label={tFilter("username")} trigger={trigger} name="username" />
      </Grid>
      <Grid item {...gridItemProps}>
        <CustomInput control={control} rules={{}} label={tFilter("gender")} trigger={trigger} name="gender">
          <Select
            renderValue={(selected) => {
              return staffGenderListObj[selected].label;
            }}
          >
            {Object.keys(staffGenderListObj).map((key) => {
              const item = staffGenderListObj[key];

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
        <CustomInput control={control} rules={{}} label={tFilter("status")} trigger={trigger} name="status">
          <Select
            renderValue={(selected) => {
              return staffStatusListObj[selected].label;
            }}
          >
            {Object.keys(staffStatusListObj).map((key) => {
              const item = staffStatusListObj[key];
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
        <CustomInput control={control} rules={{}} label={tFilter("role")} trigger={trigger} name="role">
          <Select
            renderValue={(selected) => {
              return staffRoleListObj[selected].label;
            }}
          >
            {Object.keys(staffRoleListObj).map((key) => {
              const item = staffRoleListObj[key];
              return (
                <MenuItem key={item?.value} value={item?.value}>
                  <Checkbox checked={watch().role === item?.value} />
                  <ListItemText primary={item?.label} />
                </MenuItem>
              );
            })}
          </Select>
        </CustomInput>
      </Grid>
      <Grid item {...gridItemProps}>
        <CustomInput control={control} rules={{}} label={tFilter("expertises")} trigger={trigger} name="expertises">
          <Select
            multiple
            renderValue={(selected) => {
              if (Array.isArray(selected))
                return selected
                  ?.map((cur) => {
                    return expertiseListObj[cur]?.name;
                  })
                  ?.join(", ");
              return selected;
            }}
          >
            {expertisesList.map((item) => {
              return (
                <MenuItem key={item?.id} value={item?.id}>
                  <Checkbox checked={watch().expertises?.indexOf(item?.id) > -1} />
                  <ListItemText primary={item?.name} />
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
      <Grid item {...gridItemProps}>
        <CustomDateFromToInput
          // control={control}
          // trigger={trigger}
          watchMainForm={watch}
          setMainFormValue={setValue}
          label={tFilter("schedules")}
          fromDateName="from"
          fromDateRules={{}}
          toDateName="to"
          toDateRules={{}}
          fromDateLabel={tFilter("from")}
          toDateLabel={tFilter("to")}
          previewLabel={tFilter("scheduleFromToPreview")}
        />
      </Grid>
      <Grid item {...gridItemProps}>
        <CustomInput control={control} rules={{}} label={tFilter("type")} trigger={trigger} name="type">
          <Select
            renderValue={(selected) => {
              return staffTypeListObj[selected].label;
            }}
          >
            {Object.keys(staffTypeListObj).map((key) => {
              const item = staffTypeListObj[key];

              return (
                <MenuItem key={item?.value} value={item?.value}>
                  {/* role không lấy theo ID nên để
                          checked={watch("role")?.indexOf(item?.value) > -1}   */}
                  <Checkbox checked={watch().type === item?.value} />
                  <ListItemText primary={item?.label} />
                </MenuItem>
              );
            })}
          </Select>
        </CustomInput>
      </Grid>
    </Grid>
  );
}

StaffFiltersForm.propTypes = {
  expertisesList: PropTypes.array.isRequired
};

export default StaffFiltersForm;
