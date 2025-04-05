import React, { useState } from "react";
import SquareModal from "@/components/common/SquareModal";
import { BaseRegisterDate } from "@/api/user";
import LoginStep from "@/components/login/steps/LoginStep";
import RegisterStep from "@/components/login/steps/RegisterStep";
import { RegisterResponse } from "@/api/auth";
import { persistItem } from "@/utils/persistence";

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal = ({ onClose }: LoginModalProps) => {
  const [baseRegisterDate, setBaseRegisterDate] =
    useState<BaseRegisterDate | null>(null);
  const [step, setStep] = useState(0);

  const changeUserInfo = (baseData: BaseRegisterDate) =>
    setBaseRegisterDate(baseData);

  const onRegisterComplete = (user: RegisterResponse) => {
    persistItem("profile", user);
  };

  const StepComponents = [
    <LoginStep
      key={"login"}
      changeUserInfo={changeUserInfo}
      plusStep={() => setStep((curr) => curr + 1)}
    />,
    <RegisterStep
      key={"register"}
      baseRegisterDate={baseRegisterDate}
      onRegisterComplete={onRegisterComplete}
      onModalClose={onClose}
    />,
  ];

  return (
    <SquareModal onClose={onClose} width="30%" className="min-w-[365px]">
      {StepComponents[step]}
    </SquareModal>
  );
};

export default LoginModal;
