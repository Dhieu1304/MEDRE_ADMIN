import { Checkbox, Grid, ListItemText, MenuItem, Select } from "@mui/material";

import { useFormContext } from "react-hook-form";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAppConfigStore } from "../../../store/AppConfigStore";
import CustomInput, { CustomDateFromToInput } from "../../../components/CustomInput";
import { bookingPaymentStatuses, bookingStatuses } from "../../../entities/Booking/constant";
import { scheduleTypes } from "../../../entities/Schedule/constant";

function BookingFiltersForm() {
  const { locale } = useAppConfigStore();
  const { control, trigger, watch, setValue } = useFormContext();

  const { t: tFilter } = useTranslation("bookingFeature", { keyPrefix: "BookingList.filter" });
  const { t: tSelect } = useTranslation("bookingFeature", { keyPrefix: "BookingList.select" });

  const isPaymentListObj = useMemo(() => {
    return [
      {
        label: tSelect("isPayment.paid"),
        value: bookingPaymentStatuses.PAID
      },
      {
        label: tSelect("isPayment.unpaid"),
        value: bookingPaymentStatuses.UNPAID
      },
      {
        label: tSelect("isPayment.all"),
        value: ""
      }
    ].reduce((obj, cur) => {
      return {
        ...obj,
        [cur?.value]: cur
      };
    }, {});
  }, [locale]);

  const bookingTypeListObj = useMemo(() => {
    return [
      {
        label: tSelect("types.offline"),
        value: scheduleTypes.TYPE_OFFLINE
      },
      {
        label: tSelect("types.online"),
        value: scheduleTypes.TYPE_ONLINE
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

  const bookingStatusListObj = useMemo(() => {
    return [
      {
        label: tSelect("statuses.waiting"),
        value: bookingStatuses.WAITING
      },
      {
        label: tSelect("statuses.booked"),
        value: bookingStatuses.BOOKED
      },
      {
        label: tSelect("statuses.cancel"),
        value: bookingStatuses.CANCELED
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

  const searchInputs = useMemo(
    () => [
      { name: "patientPhoneNumber", label: tFilter("patientPhoneNumber") },
      { name: "userId", label: tFilter("userId") },
      { name: "patientId", label: tFilter("patientId") },
      { name: "doctorId", label: tFilter("doctorId") },
      { name: "staffBookingId", label: tFilter("staffBookingId") },
      { name: "staffCancelId", label: tFilter("staffCancelId") }
    ],
    [locale]
  );

  const selectInputs = useMemo(
    () => [
      {
        label: tFilter("isPayment"),
        name: "isPayment",
        listObject: isPaymentListObj
      },
      {
        label: tFilter("type"),
        name: "type",
        listObject: bookingTypeListObj
      }
    ],
    [locale]
  );

  return (
    <Grid container spacing={{ xs: 2, md: 2 }} flexWrap="wrap" mb={4}>
      {searchInputs.map((searchInput) => {
        return (
          <Grid item {...gridItemProps} key={searchInput?.name}>
            <CustomInput
              control={control}
              rules={{}}
              label={searchInput.label}
              trigger={trigger}
              name={searchInput.name}
              type="text"
            />
          </Grid>
        );
      })}

      <Grid item {...gridItemProps}>
        <CustomDateFromToInput
          watchMainForm={watch}
          setMainFormValue={setValue}
          label={tFilter("bookingRange")}
          fromDateName="from"
          fromDateRules={{}}
          toDateName="to"
          toDateRules={{}}
          fromDateLabel={tFilter("from")}
          toDateLabel={tFilter("to")}
          previewLabel={tFilter("bookingRangePreview")}
        />
      </Grid>

      {selectInputs.map((selectInput) => {
        return (
          <Grid item {...gridItemProps} key={selectInput?.name}>
            <CustomInput control={control} rules={{}} label={selectInput.label} trigger={trigger} name={selectInput.name}>
              <Select
                renderValue={(selected) => {
                  return selectInput.listObject[selected].label;
                }}
              >
                {Object.keys(selectInput.listObject).map((key) => {
                  const item = selectInput.listObject[key];

                  return (
                    <MenuItem key={item?.value} value={item?.value}>
                      <Checkbox checked={watch(`${selectInput.name}`) === item?.value} />
                      <ListItemText primary={item?.label} />
                    </MenuItem>
                  );
                })}
              </Select>
            </CustomInput>
          </Grid>
        );
      })}
      <Grid item {...gridItemProps}>
        <CustomInput
          control={control}
          rules={{}}
          label={tFilter("bookingStatuses")}
          trigger={trigger}
          name="bookingStatuses"
        >
          <Select
            multiple
            renderValue={(selected) => {
              if (Array.isArray(selected))
                return selected
                  ?.map((cur) => {
                    return bookingStatusListObj[cur]?.label;
                  })
                  ?.join(", ");
              return selected;
            }}
          >
            {Object.keys(bookingStatusListObj).map((key) => {
              const item = bookingStatusListObj[key];
              return (
                <MenuItem key={item?.value} value={item?.value}>
                  <Checkbox checked={watch().bookingStatuses?.indexOf(item?.value) > -1} />
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

export default BookingFiltersForm;
