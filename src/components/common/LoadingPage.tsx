"use client";

import FireLoader from "@/components/common/FireLoader";
import GoblinTorch from "@/components/common/GoblinTorch";
import { useEffect, useState } from "react";

export default function LoadingPage() {
  const loaders = [FireLoader, GoblinTorch] as const;
  const [Loader, setLoader] = useState<(typeof loaders)[number] | null>(null);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * loaders.length);
    setLoader(loaders[randomIndex]);
  }, []);

  if (!Loader) return null;

  return (
    <div className="absolute w-screen h-screen bg-darkBg flex flex-col justify-center items-center -z-50">
      <Loader />
      <Dots />
    </div>
  );
}

const Dots = () => {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 4 ? prev + "." : "."));
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return <p className="text-4xl text-white font-bold mt-4">로딩 중{dots}</p>;
};
