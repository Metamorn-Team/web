import { register, RegisterResponse } from "@/api/auth";
import Button from "@/components/common/Button";
import useRegisterPayloadStore from "@/stores/useRegisterPayloadStore";
import { AxiosError } from "axios";
import Image from "next/image";
import React, { useState, useEffect } from "react";

interface RegisterStepProps {
  onSuccessLogin: (response: RegisterResponse) => void;
}

const RegisterStep = ({ onSuccessLogin }: RegisterStepProps) => {
  const { updatePayload, clear, nickname, tag, ...restPayload } =
    useRegisterPayloadStore();

  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState({
    nickname: "",
    tag: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChangeNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePayload({ nickname: e.target.value });
  };
  const onChangeTag = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePayload({ tag: e.target.value });
  };

  const validateInputs = () => {
    const errors = {
      nickname: "",
      tag: "",
    };

    if (nickname.length < 2 || nickname.length > 20) {
      errors.nickname = "이름은 2~20자 사이로 입력해주세요";
    }

    if (tag.length < 4 || tag.length > 15) {
      errors.tag = "태그는 4~15자 사이로 입력해주세요";
    }

    setValidationErrors(errors);
    return !errors.nickname && !errors.tag;
  };

  useEffect(() => {
    validateInputs();
  }, [nickname, tag]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateInputs()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await register({
        ...restPayload,
        nickname,
        tag,
      });
      onSuccessLogin(response);
      clear();
    } catch (e) {
      if (e instanceof AxiosError) {
        setError(e.response?.data.message || "가입 실패");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <h2 className="text-xl font-bold">캐릭터 생성</h2>
      <div className="relative w-12 h-12 text-lg">
        <p className="absolute -top-2 -right-1 z-50 animate-ping">
          {validationErrors.nickname.length || validationErrors.tag.length
            ? "💢"
            : "💚"}
        </p>
        <Image
          src={"/images/avatar/purple_pawn_avatar.png"}
          alt="메타몬"
          priority
          fill
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center w-full max-w-xs space-y-4"
      >
        <div className="w-full">
          <label className="block text-sm font-medium mb-1">
            이름을 지어주세요!
          </label>
          <input
            type="text"
            value={nickname}
            onChange={onChangeNickname}
            className={`w-full p-2 border rounded ${
              validationErrors.nickname ? "border-red-500" : "border-gray-300"
            }`}
            required
            minLength={2}
            maxLength={20}
          />

          <p className="text-red-500 text-xs mt-1">
            {validationErrors.nickname}
          </p>
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium mb-1">
            친구가 나를 찾을 떄 사용하는 태그에요!
          </label>
          <input
            type="text"
            value={tag}
            onChange={onChangeTag}
            className={`w-full p-2 border rounded ${
              validationErrors.tag ? "border-red-500" : "border-gray-300"
            }`}
            required
            minLength={4}
            maxLength={15}
          />

          <p className="text-red-500 text-xs mt-1">{validationErrors.tag}</p>
        </div>

        <p className="text-red-500 text-sm">{error}</p>

        <Button
          title={"시작하기"}
          color="yellow"
          onClick={() => {}}
          fontSize="text-lg"
          width="60%"
          disabled={
            isSubmitting ||
            !!validationErrors.nickname ||
            !!validationErrors.tag
          }
        />
        {/* <button
          type="submit"
          className={`w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={
            isSubmitting ||
            !!validationErrors.nickname ||
            !!validationErrors.tag
          }
        >
          {isSubmitting ? "처리 중..." : "가입 완료"}
        </button> */}
      </form>
    </div>
  );
};

export default RegisterStep;
