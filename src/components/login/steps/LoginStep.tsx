import { AxiosError } from "axios";
// import { useRouter } from "next/navigation";
import { login } from "@/api/auth";
import { isErrorUserInfo } from "@/api/guard/is-user-info";
import Logo from "@/components/common/Logo";
import OauthButton from "@/components/OauthButton";
import { useGoogleLogin } from "@react-oauth/google";
import useRegisterPayloadStore from "@/stores/useRegisterPayloadStore";
import { RegisterResponse } from "mmorntype";
import { useEffect } from "react";
import { useIsMobile } from "@/hook/useIsMobile";
import Alert from "@/utils/alert";

interface LoginStepProps {
  nextStep: () => void;
  onSuccessLogin: (response: RegisterResponse) => void;
}

const LoginStep = ({ nextStep, onSuccessLogin }: LoginStepProps) => {
  // const router = useRouter();
  const { updatePayload } = useRegisterPayloadStore();
  const isMobile = useIsMobile();

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

  const kakaoLogin = () => {
    if (window.Kakao) {
      // 로그인 전에 이전 로그인 상태 초기화
      try {
        if (window.Kakao.isInitialized()) {
          window.Kakao.Auth.logout();
        }
      } catch (error) {
        console.error("카카오 로그아웃 중 오류:", error);
      }

      if (isMobile) {
        // 모바일: 카카오톡 앱으로 로그인
        window.Kakao.Auth.loginForm({
          success: async (authObj: { access_token: string }) => {
            try {
              const response = await login("KAKAO", {
                accessToken: authObj.access_token,
              });
              onSuccessLogin(response);
            } catch (e: unknown) {
              if (e instanceof AxiosError) {
                const body = e.response?.data;
                if (isErrorUserInfo(body)) {
                  console.log(body);
                  if (body.error === "PROVIDER_CONFLICT") {
                    Alert.error("이미 다른 플랫폼으로 가입돼 있어요..");
                    // 카카오 계정 로그아웃하여 다른 계정으로 로그인할 수 있도록 함
                    window.Kakao.Auth.logout();
                    return;
                  }
                  const { email, provider } = body;
                  updatePayload({ email, provider });
                  nextStep();
                }
              }
            }
          },
          fail: (err: Error) => {
            console.error("카카오 로그인 실패:", err);
          },
        });
      } else {
        // 데스크톱: 팝업으로 로그인
        window.Kakao.Auth.login({
          success: async (authObj: { access_token: string }) => {
            try {
              const response = await login("KAKAO", {
                accessToken: authObj.access_token,
              });
              onSuccessLogin(response);
            } catch (e: unknown) {
              if (e instanceof AxiosError) {
                const body = e.response?.data;
                if (isErrorUserInfo(body)) {
                  console.log(body);
                  if (body.error === "PROVIDER_CONFLICT") {
                    window.Kakao.Auth.logout();

                    Alert.error("이미 다른 플랫폼으로 가입돼 있어요..");
                    // 카카오 계정 로그아웃하여 다른 계정으로 로그인할 수 있도록 함
                    return;
                  }
                  const { email, provider } = body;
                  updatePayload({ email, provider });
                  nextStep();
                }
              }
            }
          },
          fail: (err: Error) => {
            console.error("카카오 로그인 실패:", err);
          },
        });
      }
    }
  };

  useEffect(() => {
    // 카카오 SDK 초기화
    if (window.Kakao && !window.Kakao.isInitialized()) {
      const kakaoAppKey = process.env.NEXT_PUBLIC_KAKAO_APP_KEY;
      if (kakaoAppKey) {
        window.Kakao.init(kakaoAppKey);
      }
    }
  }, []);

  return (
    <div className="flex flex-col items-center gap-8 w-full h-full justify-center">
      <div className="relative w-fit">
        <Logo width="fit-content" />
      </div>
      <div className="flex flex-col justify-center items-center gap-4 w-full">
        <OauthButton type={"GOOGLE"} onClick={googleLogin} />
        <OauthButton type={"KAKAO"} onClick={kakaoLogin} />
        {/* <OauthButton type={"NAVER"} onClick={async () => {}} /> */}
      </div>
    </div>
  );
};

export default LoginStep;
