'use client'
import Card from "@/components/Card";
import Logo from "@/components/Logo";
import { useGoogleLogin } from "@react-oauth/google";

export const Home = () => {
  const googleLogin = useGoogleLogin({
    onSuccess: (code) => console.log(code),
  });

  return (
    <main className="flex justify-center items-center w-screen h-screen bg-center bg-cover bg-homeBg opacity-80">
      <Card className="flex flex-col bg-slate-300 gap-6 p-8">
        <Logo />
        <div className="flex flex-col gap-4">
          <button
            className="w-72 h-11 bg-white rounded-xl p-1 hover:bg-gray-100"
            onClick={() => googleLogin()}
          >
            <p className="text-base">구글로 계속하기</p>
          </button>
          <button className="w-72 h-11 bg-kakao rounded-xl p-1 hover:bg-kakaoHover">
            <p className="text-base text-kakaoText">카카오로 계속하기</p>
          </button>
          <button className="w-72 h-11 bg-naver rounded-xl p-1 hover:bg-naverHover">
            <p className="text-base text-white">네이버로 계속하기</p>
          </button>
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

export default Home;
