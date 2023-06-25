import { Box, Button, Checkbox, FormHelperText, Grid, ListItemText, MenuItem, Select, useTheme } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import CustomPageTitle from "../../components/CustomPageTitle";
import CustomInput from "../../components/CustomInput/CustomInput";
import { useFetchingStore } from "../../store/FetchingApiStore";
import notificationServices from "../../services/notificationServices";
import { useAppConfigStore } from "../../store/AppConfigStore";
import { notificationFors, notificationPersonalTypes, notificationTypes } from "../../entities/Notification/constant";
import { inputErrorFormat } from "../../utils/stringFormat";

function CreateNotification() {
  // const [value, setValue] = useState("");

  const { control, trigger, watch, reset, handleSubmit } = useForm({
    mode: "onChange",
    defaultValues: {
      title: "Đây là title",
      description: "Đây là description",
      content: "Đây là content",
      notificationFor: "",
      type: "",
      userOrStaffId: "",
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
  const { fetchApi } = useFetchingStore();
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
    userOrStaffId,
    personalType
  }) => {
    const data = {
      title,
      content,
      description,
      notificationFor,
      type
    };

    if (notificationFor === notificationFors.PERSONAL) {
      if (personalType === notificationPersonalTypes.STAFF) {
        data.staffId = userOrStaffId;
      } else {
        data.userId = userOrStaffId;
      }
    }
    await fetchApi(async () => {
      const res = await notificationServices.createNotification(data);
      if (res?.success) {
        reset();
      }
      return { ...res };
    });
  };

  // console.log("notification: ", notification);

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

  // console.log("watch().description: ", watch().description);

  // console.log("value: ", value);
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
                    required: watch().notificationFor === notificationFors.PERSONAL ? tInputValidation("required") : false
                  }}
                  label={tNotification("userOrStaffId")}
                  trigger={trigger}
                  name="userOrStaffId"
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
              // value: staffInputValidate.ADDRESS_MAX_LENGTH,
              // message: tInputValidation("maxLength", {
              //   maxLength: staffInputValidate.ADDRESS_MAX_LENGTH
              // })
            }
          }}
          label={tNotification("title")}
          trigger={trigger}
          name="title"
          type="text"
          multiline
          rows={6}
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
              // value: staffInputValidate.ADDRESS_MAX_LENGTH,
              // message: tInputValidation("maxLength", {
              //   maxLength: staffInputValidate.ADDRESS_MAX_LENGTH
              // })
            }
          }}
          label={tNotification("content")}
          trigger={trigger}
          name="content"
          type="text"
          multiline
          rows={15}
        />
      </Box>
      <Box sx={{ mb: 10 }}>
        <Controller
          control={control}
          rules={{
            required: tInputValidation("required"),
            maxLength: {
              value: 4,
              message: tInputValidation("maxLength", {
                maxLength: 4
              })
            }
          }}
          name="description"
          render={({ field: { value, onChange }, fieldState: { error } }) => {
            return (
              <>
                <Box sx={{ mb: 10 }}>
                  <ReactQuill
                    theme="snow"
                    value={value}
                    onChange={onChange}
                    style={{
                      height: 500
                    }}
                    modules={{
                      toolbar: [
                        [{ header: [1, 2, false] }],
                        ["bold", "italic", "underline", "strike", "blockquote"],
                        [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
                        ["link", "image"],
                        ["clean"],
                        [{ color: [] }] // Màu chữ và nền
                      ]
                    }}
                    formats={[
                      "header",
                      "bold",
                      "italic",
                      "underline",
                      "strike",
                      "blockquote",
                      "list",
                      "bullet",
                      "indent",
                      "link",
                      "image",
                      "color"
                    ]}
                  />
                </Box>
                {error?.message && (
                  <FormHelperText>
                    <Box
                      component="span"
                      sx={{
                        color: theme.palette.error.light
                      }}
                    >
                      {inputErrorFormat(tNotification("description"), error?.message)}
                    </Box>
                  </FormHelperText>
                )}
              </>
            );
          }}
        />
      </Box>
    </Box>
  );
}

export default CreateNotification;
