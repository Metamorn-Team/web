"use client";

import dynamic from "next/dynamic";
import LoadingPage from "@/components/common/LoadingPage";

const Wrapper = dynamic(() => import("./wrapper"), {
  loading: () => <LoadingPage message="섬을 찾는 중" />,
  ssr: false,
});

export default function Page() {
  return <Wrapper />;
}
