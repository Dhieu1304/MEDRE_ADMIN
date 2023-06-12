import { Button, Checkbox, Grid, InputAdornment, ListItemText, MenuItem, Select, useTheme } from "@mui/material";

import { useFormContext } from "react-hook-form";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { CheckBox as CheckBoxIcon, CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon } from "@mui/icons-material";
import { useAppConfigStore } from "../../../store/AppConfigStore";
import CustomInput from "../../../components/CustomInput";
import { useAuthStore } from "../../../store/AuthStore";

function ReExaminationFiltersForm() {
  const { locale } = useAppConfigStore();
  const { control, trigger, watch, setValue } = useFormContext();
  const theme = useTheme();

  const authStore = useAuthStore();
  const { t } = useTranslation("reExaminationFeature", { keyPrefix: "ReExaminationList" });
  const { t: tFilter } = useTranslation("reExaminationFeature", { keyPrefix: "ReExaminationList.filter" });
  const { t: tSelect } = useTranslation("reExaminationFeature", { keyPrefix: "ReExaminationList.select" });

  const isApplyListObj = useMemo(() => {
    return [
      {
        label: tSelect("isApply.true"),
        value: true
      },
      {
        label: tSelect("isApply.false"),
        value: false
      },
      {
        label: tSelect("isApply.all"),
        value: ""
      }
    ].reduce((obj, cur) => {
      return {
        ...obj,
        [cur?.value]: cur
      };
    }, {});
  }, [locale]);

  const isRemindListObj = useMemo(() => {
    return [
      {
        label: tSelect("isRemind.true"),
        value: true
      },
      {
        label: tSelect("isRemind.false"),
        value: false
      },
      {
        label: tSelect("isRemind.all"),
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
    lg: 4,
    sx: {
      p: 0,
      m: 0
    }
  };

  return (
    <Grid container spacing={{ xs: 2, md: 2 }} flexWrap="wrap" mb={4}>
      <Grid item {...gridItemProps}>
        <CustomInput control={control} rules={{}} label={tFilter("isApply")} trigger={trigger} name="isApply">
          <Select
            renderValue={(selected) => {
              return isApplyListObj[selected].label;
            }}
          >
            {Object.keys(isApplyListObj).map((key) => {
              const item = isApplyListObj[key];

              return (
                <MenuItem key={item?.value} value={item?.value}>
                  <Checkbox checked={watch().isApply === item?.value} />
                  <ListItemText primary={item?.label} />
                </MenuItem>
              );
            })}
          </Select>
        </CustomInput>
      </Grid>

      <Grid item {...gridItemProps}>
        <CustomInput control={control} rules={{}} label={tFilter("isRemind")} trigger={trigger} name="isRemind">
          <Select
            renderValue={(selected) => {
              return isRemindListObj[selected].label;
            }}
          >
            {Object.keys(isRemindListObj).map((key) => {
              const item = isRemindListObj[key];

              return (
                <MenuItem key={item?.value} value={item?.value}>
                  <Checkbox checked={watch().isRemind === item?.value} />
                  <ListItemText primary={item?.label} />
                </MenuItem>
              );
            })}
          </Select>
        </CustomInput>
      </Grid>

      <Grid item {...gridItemProps}>
        <CustomInput
          control={control}
          label={tFilter("idStaffRemind")}
          trigger={trigger}
          name="idStaffRemind"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: theme.palette.success.light,
                    color: theme.palette.success.contrastText
                  }}
                  onClick={() => {
                    if (watch().idStaffRemind === authStore.staff?.id) setValue("idStaffRemind", "");
                    else setValue("idStaffRemind", authStore.staff?.id);
                  }}
                  startIcon={watch().idStaffRemind === authStore.staff?.id ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
                >
                  {t("button.me")}
                </Button>
              </InputAdornment>
            )
          }}
        />
      </Grid>

      <Grid item {...gridItemProps}>
        <CustomInput control={control} label={tFilter("dateRemind")} trigger={trigger} name="dateRemind" type="date" />
      </Grid>

      <Grid item {...gridItemProps}>
        <CustomInput control={control} label={tFilter("dateReExam")} trigger={trigger} name="dateReExam" type="date" />
      </Grid>
    </Grid>
  );
}

export default ReExaminationFiltersForm;
