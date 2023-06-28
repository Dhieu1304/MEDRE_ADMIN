import PropTypes from "prop-types";

import { Checkbox, Grid, ListItemText, MenuItem, Select } from "@mui/material";

import CustomInput, { CustomDateFromToInput } from "../../../components/CustomInput";

export const inputComponentTypes = {
  SELECT: "SELECT",
  MULTI_SELECT: "MULTI_SELECT",
  DATE_RANGE: "DATE_RANGE"
};

function DataFilter({ inputs, filterForm }) {
  const { control, trigger, watch, setValue } = filterForm;
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
      {inputs?.map((input) => {
        let inputComponent;

        switch (input?.inputComponentType) {
          case inputComponentTypes.SELECT: {
            const inputType = "select";
            inputComponent = (
              <CustomInput control={control} label={input?.label} trigger={trigger} name={input?.name} type={inputType}>
                <Select
                  renderValue={(selected) => {
                    return input?.listObj[selected]?.label;
                  }}
                >
                  {input?.list?.map((item) => {
                    return (
                      <MenuItem key={item?.value} value={item?.value}>
                        <Checkbox checked={watch(input?.name) === item?.value} />
                        <ListItemText primary={item?.label} />
                      </MenuItem>
                    );
                  })}
                </Select>
              </CustomInput>
            );
            break;
          }

          case inputComponentTypes.MULTI_SELECT: {
            // const inputType = "select";

            inputComponent = (
              <CustomInput
                control={control}
                label={input?.label}
                trigger={trigger}
                name={input?.name}
                // type={inputType}
                // multiple
                // childrenType="select"
              >
                <Select
                  multiple
                  renderValue={(selected) => {
                    if (Array.isArray(selected))
                      return selected
                        ?.map((cur) => {
                          return input?.listObj[cur]?.label;
                        })
                        ?.join(", ");
                    return selected;
                  }}
                >
                  {input?.list?.map((item) => {
                    return (
                      <MenuItem key={item?.value} value={item?.value}>
                        <Checkbox checked={watch(input?.name)?.indexOf(item?.value) > -1} />
                        <ListItemText primary={item?.label} />
                      </MenuItem>
                    );
                  })}
                </Select>
              </CustomInput>
            );

            break;
          }

          case inputComponentTypes.DATE_RANGE: {
            inputComponent = (
              <CustomDateFromToInput
                watchMainForm={watch}
                setMainFormValue={setValue}
                fromDateRules={{}}
                toDateRules={{}}
                label={input?.label}
                fromDateName={input?.fromDateName}
                toDateName={input?.toDateName}
                fromDateLabel={input?.fromDateLabel}
                toDateLabel={input?.toDateLabel}
                previewLabel={input?.previewLabel}
              />
            );

            break;
          }

          default: {
            const inputType = input?.type || "text";
            inputComponent = (
              <CustomInput
                control={control}
                rules={{}}
                label={input?.label}
                trigger={trigger}
                name={input?.name}
                type={inputType}
              />
            );
            break;
          }
        }

        return (
          <Grid key={input?.name} item {...gridItemProps}>
            {inputComponent}
          </Grid>
        );
      })}
    </Grid>
  );
}

DataFilter.propTypes = {
  inputs: PropTypes.array.isRequired,
  filterForm: PropTypes.object.isRequired
};

export default DataFilter;
