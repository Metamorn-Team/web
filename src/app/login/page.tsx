"use client";
import Card from "@/components/Card";
import Logo from "@/components/Logo";
import OauthButton from "@/components/OauthButton";
import { useGoogleLogin } from "@react-oauth/google";

const LoginPage = () => {
  const googleLogin = useGoogleLogin({
    onSuccess: (code) => console.log(code),
  });

  return (
    <main className="flex justify-center items-center w-screen h-screen bg-center bg-cover bg-homeBg opacity-80">
      <Card className="flex flex-col bg-slate-200 gap-6 p-8 w-96 h-96">
        <Logo />
        <div className="flex flex-col items-center gap-4">
          <OauthButton type={"GOOGLE"} onClick={googleLogin} />
          <OauthButton type={"KAKAO"} onClick={() => {}} />
          <OauthButton type={"NAVER"} onClick={() => {}} />
          <button className="mt-3">
            <p className="text-sm text-stone-500 underline">
              비회원으로 시작하기
            </p>
          </button>
        </div>
      </Card>
    </main>
  );
};

export default LoginPage;
