import React, { useState, useEffect } from "react";
import { AxiosError } from "axios";
import Image from "next/image";
import { RegisterResponse } from "mmorntype";
import { register } from "@/api/auth";
import Button from "@/components/common/Button";
import useRegisterPayloadStore from "@/stores/useRegisterPayloadStore";
import RetroInput from "@/components/common/RetroInput";
import Alert from "@/utils/alert";

interface RegisterStepProps {
  onSuccessLogin: (response: RegisterResponse) => void;
}

const RegisterStep = ({ onSuccessLogin }: RegisterStepProps) => {
  const { updatePayload, clear, nickname, tag, ...restPayload } =
    useRegisterPayloadStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisibleErrorText, setIsVisibleErrorText] = useState({
    nickname: "",
    tag: "",
  });
  const [avatarEmotion, setAvatarEmotion] = useState("💢");

  const onChangeNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePayload({ nickname: e.target.value });
  };
  const onChangeTag = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePayload({ tag: e.target.value });
  };

  const validateInputs = () => {
    // 닉네임: 한글과 영어만 허용
    const isValidNicknameLength = nickname.length >= 2 && nickname.length <= 20;
    const isValidNicknameChars = /^[a-zA-Z가-힣]+$/.test(nickname);

    // 태그: 영어 소문자와 _만 허용
    const isValidTagLength = tag.length >= 4 && tag.length <= 15;
    const isValidTagChars = /^[a-z0-9_]+$/.test(tag);

    setIsVisibleErrorText((curr) => ({
      ...curr,
      nickname:
        !isValidNicknameLength && !isValidNicknameChars
          ? "이름은 2~20자 사이로 입력해주세요"
          : !isValidNicknameLength
          ? "이름은 2~20자 사이로 입력해주세요"
          : !isValidNicknameChars
          ? "이름은 영어 대소문자와 한글만 사용 가능해요"
          : "",

      tag:
        !isValidTagLength && !isValidTagChars
          ? "태그는 4~15자 사이로 입력해주세요"
          : !isValidTagLength
          ? "태그는 4~15자 사이로 입력해주세요"
          : !isValidTagChars
          ? "태그는 영어 소문자와 _ 만 사용 가능해요"
          : "",
    }));

    setAvatarEmotion(
      isValidNicknameLength &&
        isValidNicknameChars &&
        isValidTagLength &&
        isValidTagChars
        ? "💜"
        : "💢"
    );
  };

  useEffect(() => {
    validateInputs();
  }, [nickname, tag]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting || isVisibleErrorText.nickname || isVisibleErrorText.tag) {
      Alert.error("😡😡😡😡", false);
      return;
    }

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
        <div className="relative w-12 h-12 mb-4">
          <p className="absolute -top-2 -right-1 z-50 animate-ping">
            {avatarEmotion}
          </p>
          <Image
            src={`/images/avatar/${
              restPayload.avatarKey || "purple_pawn_avatar"
            }.png`}
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
            <label className="block text-sm font-semibold mb-1 w-fit">
              이름을 지어주세요!
            </label>
            <RetroInput
              value={nickname}
              onChange={onChangeNickname}
              maxLength={20}
              error={isVisibleErrorText.nickname !== ""}
            />

            <p
              className={`text-red-600 text-xs mt-1 w-fit ${
                isVisibleErrorText.nickname ? "opacity-100" : "opacity-0"
              }`}
              style={{ minHeight: "1.25rem" }}
            >
              {isVisibleErrorText.nickname}
            </p>
          </div>

          <div className="w-full max-w-[305px]">
            <label className="block text-sm font-semibold mb-1">
              친구가 나를 찾을 때 사용하는 태그에요!
            </label>
            <RetroInput
              value={tag}
              onChange={onChangeTag}
              maxLength={15}
              error={isVisibleErrorText.tag !== ""}
            />

            <p
              className={`text-red-600 text-xs mt-1 ${
                isVisibleErrorText.tag ? "opacity-100" : "opacity-0"
              }`}
              style={{ minHeight: "1.25rem" }}
            >
              {isVisibleErrorText.tag}
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
        />
      </form>
    </div>
  );
};

export default RegisterStep;
