import { AxiosError } from "axios";
// import { useRouter } from "next/navigation";
import { login } from "@/api/auth";
import { isErrorUserInfo } from "@/api/guard/is-user-info";
import Logo from "@/components/common/Logo";
import OauthButton from "@/components/OauthButton";
import { useGoogleLogin } from "@react-oauth/google";
import useRegisterPayloadStore from "@/stores/useRegisterPayloadStore";
import { RegisterResponse } from "mmorntype";

interface LoginStepProps {
  nextStep: () => void;
  onSuccessLogin: (response: RegisterResponse) => void;
}

const LoginStep = ({ nextStep, onSuccessLogin }: LoginStepProps) => {
  // const router = useRouter();
  const { updatePayload } = useRegisterPayloadStore();

  const googleLogin = useGoogleLogin({
    onSuccess: async (code) => {
      try {
        const response = await login("GOOGLE", {
          accessToken: code.access_token,
        });
        onSuccessLogin(response);
      } catch (e: unknown) {
        if (e instanceof AxiosError) {
          const body = e.response?.data;
          if (isErrorUserInfo(body)) {
            const { email, provider } = body;
            updatePayload({ email, provider });
            nextStep();
          }
        }
      }
    },
  });

  return (
    <div className="flex flex-col items-center gap-8 w-full h-full justify-center">
      <div className="relative w-fit">
        <Logo width="fit-content" />
      </div>
      <div className="flex flex-col justify-center items-center gap-4 w-full">
        <OauthButton type={"GOOGLE"} onClick={googleLogin} />
        {/* <OauthButton
          type={"KAKAO"}
          onClick={() => {
            router.replace("/");
          }}
        />
        <OauthButton type={"NAVER"} onClick={async () => {}} /> */}
      </div>
    </div>
  );
};

export default LoginStep;
