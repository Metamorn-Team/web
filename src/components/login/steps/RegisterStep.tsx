import React, { useState, useEffect } from "react";
import { AxiosError } from "axios";
import Image from "next/image";
import { register, RegisterResponse } from "@/api/auth";
import Button from "@/components/common/Button";
import useRegisterPayloadStore from "@/stores/useRegisterPayloadStore";

interface RegisterStepProps {
  onSuccessLogin: (response: RegisterResponse) => void;
}

const RegisterStep = ({ onSuccessLogin }: RegisterStepProps) => {
  const { updatePayload, clear, nickname, tag, ...restPayload } =
    useRegisterPayloadStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisibleErrorText, setIsVisibleErrorText] = useState({
    nickname: false,
    tag: false,
  });
  const [avatarEmotion, setAvatarEmotion] = useState("💢");

  const onChangeNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePayload({ nickname: e.target.value });
  };
  const onChangeTag = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePayload({ tag: e.target.value });
  };

  const validateInputs = () => {
    const isValidNickname = nickname.length >= 2 && nickname.length <= 20;
    const isValidTag = tag.length >= 4 && tag.length <= 15;

    setIsVisibleErrorText((curr) => ({
      ...curr,
      nickname: !isValidNickname,
    }));

    setIsVisibleErrorText((curr) => ({
      ...curr,
      tag: !isValidTag,
    }));

    setAvatarEmotion(isValidNickname && isValidTag ? "💜" : "💢");
  };

  useEffect(() => {
    validateInputs();
  }, [nickname, tag]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

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
        // setError(e.response?.data.message || "가입 실패");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between w-full flex-grow">
      <div className="flex flex-col justify-center text-lg h-full">
        <div className="relative w-12 h-12">
          <p className="absolute -top-2 -right-1 z-50 animate-ping">
            {avatarEmotion}
          </p>
          <Image
            src={"/images/avatar/purple_pawn_avatar.png"}
            alt="메타몬"
            priority
            fill
          />
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center w-full gap-8"
      >
        <div className="flex flex-col w-full px-4 justify-between items-center gap-3">
          <div className="w-full h-full max-w-[305px]">
            <label className="block text-sm font-medium mb-1 w-fit">
              이름을 지어주세요!
            </label>
            <input
              type="text"
              value={nickname}
              onChange={onChangeNickname}
              className={`w-full p-2 border rounded ${
                isVisibleErrorText.nickname
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              required
              minLength={2}
              maxLength={20}
            />

            <p
              className={`text-red-500 text-xs mt-1 w-fit ${
                isVisibleErrorText.nickname ? "opacity-100" : "opacity-0"
              }`}
            >
              이름은 2~20자 사이로 입력해주세요
            </p>
          </div>

          <div className="w-full max-w-[305px]">
            <label className="block text-sm font-medium mb-1">
              친구가 나를 찾을 때 사용하는 태그에요!
            </label>
            <input
              type="text"
              value={tag}
              onChange={onChangeTag}
              className={`w-full p-2 border rounded ${
                isVisibleErrorText.tag ? "border-red-500" : "border-gray-300"
              }`}
              required
              minLength={4}
              maxLength={15}
            />

            <p
              className={`text-red-500 text-xs mt-1 ${
                isVisibleErrorText.tag ? "opacity-100" : "opacity-0"
              }`}
            >
              태그는 4~15자 사이로 입력해주세요
            </p>
          </div>
        </div>

        <Button
          title={"시작하기"}
          color="yellow"
          onClick={() => {}}
          fontSize="text-lg"
          width="50%"
          isSubmitType
          className="max-w-[190px]"
          disabled={
            isSubmitting ||
            !!isVisibleErrorText.nickname ||
            !!isVisibleErrorText.tag
          }
        />
      </form>
    </div>
  );
};

export default RegisterStep;
