import React, { useState } from "react";
import SquareModal from "@/components/common/SquareModal";
import LoginStep from "@/components/login/steps/LoginStep";
import RegisterStep from "@/components/login/steps/RegisterStep";
import { persistItem } from "@/utils/persistence";
import SelectAvatarStep from "@/components/login/steps/SelectAvatarStep";
import useRegisterPayloadStore from "@/stores/useRegisterPayloadStore";
import { RegisterResponse } from "mmorn-type";

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal = ({ onClose }: LoginModalProps) => {
  const { clear } = useRegisterPayloadStore();
  const [step, setStep] = useState(0);

  const onCloseWithStateClear = () => {
    onClose();
    clear();
  };

  const onSuccessLogin = (response: RegisterResponse) => {
    const { accessToken, ...user } = response;
    persistItem("access_token", accessToken);
    persistItem("profile", user);

    onCloseWithStateClear();

    window.location.reload();
  };

  const nextStep = () => setStep((curr) => curr + 1);

  const StepComponents = [
    <LoginStep
      key={"login"}
      nextStep={nextStep}
      onSuccessLogin={onSuccessLogin}
    />,
    <SelectAvatarStep key={"avatar"} nextStep={nextStep} />,
    <RegisterStep key={"register"} onSuccessLogin={onSuccessLogin} />,
  ];

  return (
    <SquareModal
      onClose={onCloseWithStateClear}
      width="30%"
      className="min-w-[365px]"
    >
      {StepComponents[step]}
    </SquareModal>
  );
};

export default LoginModal;
