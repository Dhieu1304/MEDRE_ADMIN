import { FormProvider, useForm } from "react-hook-form";

import PropTypes from "prop-types";

import { useMemo, useState } from "react";

import { useLocation } from "react-router-dom";
import EmailVerify from "./EmailVerify";
import InfoForm from "./InfoForm";
import OtpVerify from "./OtpVerify";
import FinishOtpVerify from "./FinishOtpVerify";

import patternConfig from "../../../../config/patternConfig";
import { useFetchingStore } from "../../../../store/FetchingApiStore";
import authServices from "../../../../services/authServices";
import CustomOverlay from "../../../../components/CustomOverlay/CustomOverlay";

const steps = {
  SEND_INFO: "SEND_INFO",
  VERIFY: {
    EMAIL: "VERIFY_EMAIL",
    OTP: "VERIFY_OTP"
  },
  FINISH: {
    OTP: "FINISH_OTP"
  }
};

function VerificationForm({ sendVerificationOtpToPhone, sendVerificationToEmail }) {
  // const [step, setStep] = useState(4);

  const location = useLocation();
  const [initPhoneNumberOrEmail, initStep] = useMemo(() => {
    const phoneNumberOrEmail = location.state?.phoneNumberOrEmail || "";
    const isFinishSendInfoStep = location.state?.isFinishSendInfoStep;
    let initStepData = steps.SEND_INFO;

    if (patternConfig.phonePattern.test(phoneNumberOrEmail)) {
      if (isFinishSendInfoStep) {
        initStepData = steps.VERIFY.OTP;
      }
    } else if (patternConfig.emailPattern.test(phoneNumberOrEmail)) {
      if (isFinishSendInfoStep) {
        initStepData = steps.VERIFY.EMAIL;
      }
    }

    return [phoneNumberOrEmail, initStepData];
  }, []);

  const [step, setStep] = useState(initStep);
  const { isLoading, fetchApi } = useFetchingStore();

  const infoForm = useForm({
    mode: "onChange",
    defaultValues: {
      phoneNumberOrEmail: initPhoneNumberOrEmail
    },
    criteriaMode: "all"
  });

  const otpVerifyForm = useForm({
    mode: "onChange",
    defaultValues: {
      otp: ""
    },
    criteriaMode: "all"
  });

  const resendVerification = async () => {
    const { phoneNumberOrEmail } = infoForm.watch();
    if (patternConfig.phonePattern.test(phoneNumberOrEmail)) {
      await sendVerificationOtpToPhone(phoneNumberOrEmail);
    } else if (patternConfig.emailPattern.test(phoneNumberOrEmail)) {
      await sendVerificationToEmail(phoneNumberOrEmail);
    } else {
      setStep(steps.SEND_INFO);
    }
  };

  const handleSendVerification = async ({ phoneNumberOrEmail }) => {
    if (patternConfig.phonePattern.test(phoneNumberOrEmail)) {
      const res = await sendVerificationOtpToPhone(phoneNumberOrEmail);
      if (res?.success) {
        setStep(steps.VERIFY.OTP);
      }
    } else {
      const res = await sendVerificationToEmail(phoneNumberOrEmail);
      if (res?.success) {
        setStep(steps.VERIFY.EMAIL);
      }
    }
  };

  const handleVerifyOtp = async ({ otp }) => {
    await fetchApi(async () => {
      const res = await authServices.verifyOtpToVerfifyPhoneNumber(otp);
      if (res.success) {
        setStep(steps.FINISH.OTP);
        return { ...res };
      }
      return { ...res };
    });
  };

  const backToFirstStep = () => {
    setStep(steps.SEND_INFO);
    otpVerifyForm.reset({
      otp: ""
    });
  };

  const render = () => {
    switch (step) {
      case steps.SEND_INFO:
        return (
          <FormProvider {...infoForm}>
            <InfoForm handleSendVerification={handleSendVerification} />;
          </FormProvider>
        );
      case steps.VERIFY.OTP:
        return (
          <FormProvider {...otpVerifyForm}>
            <OtpVerify
              handleVerifyOtp={handleVerifyOtp}
              backToFirstStep={backToFirstStep}
              resendVerification={resendVerification}
            />
            ;
          </FormProvider>
        );
      case steps.VERIFY.EMAIL:
        return <EmailVerify backToFirstStep={backToFirstStep} resendVerification={resendVerification} />;

      case steps.FINISH.OTP:
        return <FinishOtpVerify backToFirstStep={backToFirstStep} resendVerification={resendVerification} />;

      default:
        return (
          <FormProvider {...infoForm}>
            <InfoForm handleSendVerification={handleSendVerification} />;
          </FormProvider>
        );
    }
  };

  return (
    <>
      <CustomOverlay open={isLoading} />
      {render()}
    </>
  );
}

VerificationForm.propTypes = {
  sendVerificationOtpToPhone: PropTypes.func.isRequired,
  sendVerificationToEmail: PropTypes.func.isRequired
};

export default VerificationForm;
