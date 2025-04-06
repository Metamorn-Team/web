import React, { useState } from "react";
import SquareModal from "@/components/common/SquareModal";
import LoginStep from "@/components/login/steps/LoginStep";
import RegisterStep from "@/components/login/steps/RegisterStep";
import { persistItem } from "@/utils/persistence";
import { RegisterResponse } from "@/api/auth";

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal = ({ onClose }: LoginModalProps) => {
  const [step, setStep] = useState(0);

  const onSuccessLogin = (response: RegisterResponse) => {
    const { accessToken, ...user } = response;
    persistItem("access_token", accessToken);
    persistItem("profile", user);

    onClose();

    window.location.reload();
  };

  const StepComponents = [
    <LoginStep
      key={"login"}
      plusStep={() => setStep((curr) => curr + 1)}
      onSuccessLogin={onSuccessLogin}
    />,
    <RegisterStep key={"register"} onSuccessLogin={onSuccessLogin} />,
  ];

  return (
    <SquareModal onClose={onClose} width="30%" className="min-w-[365px]">
      {StepComponents[step]}
    </SquareModal>
  );
};

export default LoginModal;
