import { Box, Button, Checkbox, Grid, ListItemText, MenuItem, Select, Typography, useTheme } from "@mui/material";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

import CustomPageTitle from "../../components/CustomPageTitle";
import CustomInput from "../../components/CustomInput/CustomInput";
import { useFetchingStore } from "../../store/FetchingApiStore";
import notificationServices from "../../services/notificationServices";
import { useAppConfigStore } from "../../store/AppConfigStore";
import { notificationFors, notificationPersonalTypes, notificationTypes } from "../../entities/Notification/constant";
import CustomHtmlInput from "../../components/CustomInput/CustomHtmlInput";
import patternConfig from "../../config/patternConfig";

function CreateNotification() {
  // const [value, setValue] = useState("");

  const { control, trigger, watch, reset, setValue, handleSubmit } = useForm({
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      content: "",
      notificationFor: "",
      type: "",
      userOrStaffEmailPhoneId: "",
      personalType: notificationPersonalTypes.USER
    },
    criteriaMode: "all"
  });

  const { locale } = useAppConfigStore();

  const { t } = useTranslation("notificationFeature", { keyPrefix: "CreateNotification" });
  const { t: tNotification } = useTranslation("notificationEntity", { keyPrefix: "properties" });
  const { t: tNotificationFors } = useTranslation("notificationEntity", { keyPrefix: "constants.notificationFor" });
  const { t: tNotificationTypes } = useTranslation("notificationEntity", { keyPrefix: "constants.types" });
  const { t: tNotificationPersonalTypes } = useTranslation("notificationEntity", { keyPrefix: "constants.personalTypes" });
  const { t: tInputValidation } = useTranslation("input", { keyPrefix: "validation" });
  const { t: tInputMessages } = useTranslation("input", { keyPrefix: "messages" });
  const { fetchApi, fetchApiError } = useFetchingStore();
  const theme = useTheme();

  const [notificationForList, notificationForListObj] = useMemo(() => {
    const list = [
      {
        label: tNotificationFors("allSystem"),
        value: notificationFors.ALL_SYSTEM
      },
      {
        label: tNotificationFors("personal"),
        value: notificationFors.PERSONAL
      },
      {
        label: tNotificationFors("user"),
        value: notificationFors.USER
      },
      {
        label: tNotificationFors("staff"),
        value: notificationFors.STAFF
      },
      {
        label: tNotificationFors("admin"),
        value: notificationFors.ADMIN
      },
      {
        label: tNotificationFors("doctor"),
        value: notificationFors.DOCTOR
      },
      {
        label: tNotificationFors("nurse"),
        value: notificationFors.NURSE
      },
      {
        label: tNotificationFors("customerService"),
        value: notificationFors.CUSTOMER_SERVICE
      }
    ];

    const listObj = list.reduce((obj, cur) => {
      return {
        ...obj,
        [cur?.value]: cur
      };
    }, {});

    return [list, listObj];
  }, [locale]);

  const [notificationTypeList, notificationTypeListObj] = useMemo(() => {
    const list = [
      {
        label: tNotificationTypes("avertisement"),
        value: notificationTypes.ADVERTISEMENT
      },
      {
        label: tNotificationTypes("event"),
        value: notificationTypes.EVENT
      }
    ];

    const listObj = list.reduce((obj, cur) => {
      return {
        ...obj,
        [cur?.value]: cur
      };
    }, {});

    return [list, listObj];
  }, [locale]);

  const [notificationPersonalTypeList, notificationPersonalTypeListObj] = useMemo(() => {
    const list = [
      {
        label: tNotificationPersonalTypes("staff"),
        value: notificationPersonalTypes.STAFF
      },
      {
        label: tNotificationPersonalTypes("user"),
        value: notificationPersonalTypes.USER
      }
    ];

    const listObj = list.reduce((obj, cur) => {
      return {
        ...obj,
        [cur?.value]: cur
      };
    }, {});

    return [list, listObj];
  }, [locale]);

  const handleCreateNotification = async ({
    title,
    content,
    description,
    notificationFor,
    type,
    userOrStaffEmailPhoneId,
    personalType
  }) => {
    const descriptionWithoutHtml = watch()
      .description?.replace(/<[^>]+>/g, "")
      .trim();
    const descriptionWithoutTabBreakLine = descriptionWithoutHtml?.replace(/\s+/g, " ").trim();
    if (!descriptionWithoutTabBreakLine) {
      setValue("description", "");
      trigger("description");
      return;
    }

    const data = {
      title,
      content,
      description,
      notificationFor,
      type
    };

    if (notificationFor === notificationFors.PERSONAL) {
      let id;
      let phoneNumber;
      let email;

      if (patternConfig.uuidPattern.test(userOrStaffEmailPhoneId)) {
        id = userOrStaffEmailPhoneId;
      } else if (patternConfig.phonePattern.test(userOrStaffEmailPhoneId)) {
        phoneNumber = userOrStaffEmailPhoneId;
      } else if (patternConfig.emailPattern.test(userOrStaffEmailPhoneId)) {
        email = userOrStaffEmailPhoneId;
      } else {
        trigger();
        return;
      }

      if (personalType === notificationPersonalTypes.STAFF) {
        data.staffEmail = email;
        data.staffPhoneNumber = phoneNumber;
        data.staffId = id;
      } else {
        data.userEmail = email;
        data.stafuserPhoneNumberfPhoneNumber = phoneNumber;
        data.userId = id;
      }
    }

    // console.log("data: ", data);

    await fetchApi(async () => {
      const res = await notificationServices.createNotification(data);
      if (res?.success) {
        reset();
      }
      return { ...res };
    });
  };

  //

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
    <Box>
      <CustomPageTitle
        title={t("title")}
        right={
          <Button
            variant="contained"
            sx={{
              backgroundColor: theme.palette.success.light,
              color: theme.palette.success.contrastText
            }}
            onClick={handleSubmit(handleCreateNotification)}
          >
            {t("button.save")}
          </Button>
        }
      />
      <Box
        sx={{
          mb: 2
        }}
      >
        <Grid container spacing={{ xs: 2, md: 2 }} flexWrap="wrap" mb={4}>
          <Grid item {...gridItemProps}>
            <CustomInput
              control={control}
              rules={{
                required: tInputValidation("required")
              }}
              label={tNotification("notificationFor")}
              trigger={trigger}
              name="notificationFor"
              type="select"
            >
              <Select
                renderValue={(selected) => {
                  return notificationForListObj[selected]?.label;
                }}
              >
                {notificationForList?.map((item) => {
                  return (
                    <MenuItem key={item?.value} value={item?.value}>
                      <Checkbox checked={watch().notificationFor === item?.value} />
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
              rules={{
                required: tInputValidation("required")
              }}
              label={tNotification("type")}
              trigger={trigger}
              name="type"
              type="select"
            >
              <Select
                renderValue={(selected) => {
                  return notificationTypeListObj[selected]?.label;
                }}
              >
                {notificationTypeList?.map((item) => {
                  return (
                    <MenuItem key={item?.value} value={item?.value}>
                      <Checkbox checked={watch().type === item?.value} />
                      <ListItemText primary={item?.label} />
                    </MenuItem>
                  );
                })}
              </Select>
            </CustomInput>
          </Grid>
          {watch().notificationFor === notificationFors.PERSONAL && (
            <>
              <Grid item {...gridItemProps}>
                <CustomInput
                  control={control}
                  rules={{
                    required: watch().notificationFor === notificationFors.PERSONAL ? tInputValidation("required") : false,
                    pattern:
                      watch().notificationFor === notificationFors.PERSONAL
                        ? {
                            value: patternConfig.phoneOrEmailOrIdPattern,
                            message: tInputValidation("format")
                          }
                        : undefined
                  }}
                  label={tNotification("userOrStaffEmailPhoneId")}
                  trigger={trigger}
                  name="userOrStaffEmailPhoneId"
                />
              </Grid>

              <Grid item {...gridItemProps}>
                <CustomInput
                  control={control}
                  rules={{
                    required: watch().notificationFor === notificationFors.PERSONAL ? tInputValidation("required") : false
                  }}
                  label={tNotification("personalType")}
                  trigger={trigger}
                  name="personalType"
                  type="select"
                >
                  <Select
                    renderValue={(selected) => {
                      return notificationPersonalTypeListObj[selected]?.label;
                    }}
                  >
                    {notificationPersonalTypeList?.map((item) => {
                      return (
                        <MenuItem key={item?.value} value={item?.value}>
                          <Checkbox checked={watch().personalType === item?.value} />
                          <ListItemText primary={item?.label} />
                        </MenuItem>
                      );
                    })}
                  </Select>
                </CustomInput>
              </Grid>
            </>
          )}
        </Grid>

        <Box
          sx={{
            width: "100%"
          }}
        >
          {fetchApiError && <Typography sx={{ color: theme.palette.error.light }}>{tInputMessages("general")}</Typography>}
        </Box>
      </Box>
      <Box
        sx={{
          mb: 2
        }}
      >
        <CustomInput
          control={control}
          rules={{
            required: tInputValidation("required"),
            maxLength: {
              value: 512,
              message: tInputValidation("maxLength", {
                maxLength: 512
              })
            }
          }}
          label={tNotification("title")}
          trigger={trigger}
          name="title"
          type="text"
          multiline
          rows={2}
        />
      </Box>

      <Box
        sx={{
          mb: 2
        }}
      >
        <CustomInput
          control={control}
          rules={{
            required: tInputValidation("required"),
            maxLength: {
              value: 1024,
              message: tInputValidation("maxLength", {
                maxLength: 1024
              })
            }
          }}
          label={tNotification("content")}
          trigger={trigger}
          name="content"
          type="text"
          multiline
          rows={4}
        />
      </Box>

      <Typography
        sx={{
          fontSize: 18,
          fontWeight: 600,
          mt: 2,
          mb: 2
        }}
      >
        {tNotification("description")}
      </Typography>
      <Box sx={{ mb: 10 }}>
        <CustomHtmlInput
          label={tNotification("description")}
          control={control}
          name="description"
          rules={{
            required: tInputValidation("required"),
            maxLength: {
              value: 2048,
              message: tInputValidation("maxLength", {
                maxLength: 2048
              })
            }
          }}
        />
      </Box>
    </Box>
  );
}

export default CreateNotification;
