import { Box, Button, useTheme } from "@mui/material";
import { useForm } from "react-hook-form";
import CustomPageTitle from "../../components/CustomPageTitle";
import CustomInput from "../../components/CustomInput/CustomInput";
import { useFetchingStore } from "../../store/FetchingApiStore";
import notificationServices from "../../services/notificationServices";

function CreateNotification() {
  const { control, trigger, reset, handleSubmit } = useForm({
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      content: ""
    },
    criteriaMode: "all"
  });

  const { fetchApi } = useFetchingStore();
  const theme = useTheme();

  const handleCreateNotification = async ({ title, content, description }) => {
    await fetchApi(async () => {
      const res = await notificationServices.createNotification({ title, content, description });
      if (res?.success) {
        reset();
      }
      return { ...res };
    });
  };

  // console.log("notification: ", notification);
  return (
    <Box>
      <CustomPageTitle
        title="Tạo thông báo"
        right={
          <Button
            variant="contained"
            sx={{
              backgroundColor: theme.palette.success.light,
              color: theme.palette.success.contrastText
            }}
            onClick={handleSubmit(handleCreateNotification)}
          >
            Lưu
          </Button>
        }
      />
      <Box
        sx={{
          mb: 2
        }}
      >
        <CustomInput
          control={control}
          rules={{
            required: "Bắt buộc",
            maxLength: {
              // value: staffInputValidate.ADDRESS_MAX_LENGTH,
              // message: tInputValidation("maxLength", {
              //   maxLength: staffInputValidate.ADDRESS_MAX_LENGTH
              // })
            }
          }}
          label="Tiêu đề"
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
            required: "Bắt buộc",
            maxLength: {
              // value: staffInputValidate.ADDRESS_MAX_LENGTH,
              // message: tInputValidation("maxLength", {
              //   maxLength: staffInputValidate.ADDRESS_MAX_LENGTH
              // })
            }
          }}
          label="Mô tả"
          trigger={trigger}
          name="description"
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
            required: "Bắt buộc",
            maxLength: {
              // value: staffInputValidate.ADDRESS_MAX_LENGTH,
              // message: tInputValidation("maxLength", {
              //   maxLength: staffInputValidate.ADDRESS_MAX_LENGTH
              // })
            }
          }}
          label="Nội dung"
          trigger={trigger}
          name="content"
          type="text"
          multiline
          rows={15}
        />
      </Box>
    </Box>
  );
}

export default CreateNotification;
