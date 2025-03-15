import { lazy, Suspense } from "react";

const GameHome = lazy(() => import("../components/game-home"));

export default function Home() {
  return (
    <div>
      <Suspense fallback={<div className="h-dvh bg-blue-950">loading..</div>}>
        <GameHome />
      </Suspense>
    </div>
  );
}
