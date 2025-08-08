"use client";

import dynamic from "next/dynamic";

const Wrapper = dynamic(() => import("./wrapper"), {
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-[#f9f5ec] text-[#5c4b32]">
      <div className="text-lg font-bold animate-pulse">섬을 찾는 중...</div>
    </div>
  ),
  ssr: false,
});

export default function Page() {
  return <Wrapper />;
}
