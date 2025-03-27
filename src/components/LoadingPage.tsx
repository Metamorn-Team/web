import FireLoader from "@/components/FireLoader";
import { useEffect, useState } from "react";

export default function LoadingPage() {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 4 ? prev + "." : "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-screen h-screen bg-darkBg flex flex-col justify-center items-center">
      <FireLoader />
      <p className="text-4xl text-white font-bold mt-4">로딩 중{dots}</p>
    </div>
  );
}
