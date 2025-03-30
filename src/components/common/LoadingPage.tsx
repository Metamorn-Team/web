import FireLoader from "@/components/common/FireLoader";
import { useEffect, useState } from "react";

export default function LoadingPage() {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 4 ? prev + "." : "."));
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute w-screen h-screen bg-darkBg flex flex-col justify-center items-center -z-50">
      <FireLoader />
      <p className="text-4xl text-white font-bold mt-4">로딩 중{dots}</p>
    </div>
  );
}
