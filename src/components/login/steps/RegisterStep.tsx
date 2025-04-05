import { register, RegisterResponse } from "@/api/auth";
import { BaseRegisterDate } from "@/api/user";
import { AxiosError } from "axios";
import React, { useState, useEffect } from "react";

interface RegisterStepProps {
  baseRegisterDate: BaseRegisterDate | null;
  onRegisterComplete: (user: RegisterResponse) => void;
  onModalClose: () => void;
}

const RegisterStep = ({
  baseRegisterDate,
  onRegisterComplete,
  onModalClose,
}: RegisterStepProps) => {
  const [nickname, setNickname] = useState("");
  const [tag, setTag] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState({
    nickname: "",
    tag: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateInputs = () => {
    const errors = {
      nickname: "",
      tag: "",
    };

    if (nickname.length < 2 || nickname.length > 20) {
      errors.nickname = "닉네임은 2~20자 사이로 입력해주세요";
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
      if (baseRegisterDate) {
        const payload = {
          ...baseRegisterDate,
          nickname,
          tag,
        };

        const response = await register(payload);
        onRegisterComplete(response);
        onModalClose();
      }
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
      <h2 className="text-xl font-bold">추가 정보 입력</h2>

      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            닉네임 (2~20자)
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className={`w-full p-2 border rounded ${
              validationErrors.nickname ? "border-red-500" : "border-gray-300"
            }`}
            required
            minLength={2}
            maxLength={20}
          />
          {validationErrors.nickname && (
            <p className="text-red-500 text-xs mt-1">
              {validationErrors.nickname}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            태그 (4~15자)
          </label>
          <input
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className={`w-full p-2 border rounded ${
              validationErrors.tag ? "border-red-500" : "border-gray-300"
            }`}
            required
            minLength={4}
            maxLength={15}
          />
          {validationErrors.tag && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.tag}</p>
          )}
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
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
        </button>
      </form>
    </div>
  );
};

export default RegisterStep;
