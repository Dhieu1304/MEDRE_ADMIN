import { Box, Typography, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import routeConfig from "../../config/routeConfig";
import { useAuthStore } from "../../store/AuthStore";
import AuthInput from "./components/AuthInput";

export default function Login() {
  const { handleSubmit, control, trigger } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "d.hieu.13.04@gmail.com",
      password: "dhieu1304"
    },
    criteriaMode: "all"
  });

  const authStore = useAuthStore();
  const navigate = useNavigate();

  const onLogin = async ({ email, password }) => {
    const result = await authStore.loginByEmail(email, password);
    if (result) {
      navigate(routeConfig.home);
    }
  };

  const requireErrorMessage = "field can not empty";

  return (
    <>
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>
      <Box component="form" noValidate onSubmit={handleSubmit(onLogin)} sx={{ marginTop: 1 }}>
        <AuthInput
          control={control}
          rules={{
            required: requireErrorMessage,
            // https://ihateregex.io/expr/phone/
            pattern: {
              value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
              message: "is wrong format"
            }
          }}
          label="Email"
          trigger={trigger}
          name="email"
          type="email"
        />

        <AuthInput
          control={control}
          rules={{
            required: requireErrorMessage,
            minLength: {
              value: 8,
              message: "must be at least 8 characters"
            },
            pattern: {
              value: /(?=.*[a-zA-Z])(?=.*[0-9])/,
              message: "must have at least 1 digit and 1 character"
            }
          }}
          label="Password"
          trigger={trigger}
          name="password"
          type="password"
        />

        <Button type="submit" fullWidth variant="contained" sx={{ mb: 2, p: 1, fontSize: 10 }}>
          Login
        </Button>
      </Box>
    </>
  );
}
