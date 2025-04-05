import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { login } from "@/api/auth";
import { isErrorUserInfo } from "@/api/guard/is-user-info";
import { BaseRegisterDate } from "@/api/user";
import Logo from "@/components/common/Logo";
import OauthButton from "@/components/OauthButton";
import { persistItem } from "@/utils/persistence";
import { useGoogleLogin } from "@react-oauth/google";

const LoginStep = ({
  changeUserInfo,
  plusStep,
}: {
  changeUserInfo: (userInfo: BaseRegisterDate) => void;
  plusStep: () => void;
}) => {
  const router = useRouter();

  const googleLogin = useGoogleLogin({
    onSuccess: async (code) => {
      try {
        const data = await login("GOOGLE", { accessToken: code.access_token });
        const { accessToken, ...user } = data;
        persistItem("access_token", accessToken);
        persistItem("profile", user);

        window.location.reload();
      } catch (e: unknown) {
        if (e instanceof AxiosError) {
          const body = e.response?.data;
          if (isErrorUserInfo(body)) {
            const { email, provider } = body;
            changeUserInfo({ email, provider });
            plusStep();
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
        <OauthButton type={"GOOGLE"} width="90%" onClick={googleLogin} />
        <OauthButton
          type={"KAKAO"}
          width="90%"
          onClick={() => {
            router.replace("/");
          }}
        />
        <OauthButton type={"NAVER"} width="90%" onClick={async () => {}} />
      </div>
    </div>
  );
};

export default LoginStep;
