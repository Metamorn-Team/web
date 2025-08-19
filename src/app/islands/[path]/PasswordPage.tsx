"use client";

import { useState, useRef, useEffect } from "react";
import Pawn from "@/components/common/Pawn";
import { useCheckPrivateIslandPassword } from "@/hook/queries/useCheckPrivateIslandPassword";
import GameWrapper from "@/components/GameWrapper";
import { useIslandStore } from "@/stores/useIslandStore";
import { setItem } from "@/utils/session-storage";
import { ISLAND_SCENE } from "@/constants/game/islands/island";

export default function PasswordPage({ islandId }: { islandId: string }) {
  const { setIsland } = useIslandStore();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [lastSubmit, setLastSubmit] = useState(0);

  const [isGameLoading, setIsGameLoading] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const { mutate: checkPrivateIslandPassword } = useCheckPrivateIslandPassword(
    () => {
      setIsland(islandId, "PRIVATE", password);
      setItem("current_scene", ISLAND_SCENE);
      setIsVerified(true);
    },
    () => {
      setError("암호가 올바르지 않습니다.");
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const now = Date.now();
    if (now - lastSubmit < 1000) {
      return;
    }
    setLastSubmit(now);

    setError(null);
    setLoading(true);

    checkPrivateIslandPassword({
      islandId,
      body: { password },
    });
    setLoading(false);
  };

  if (isVerified) {
    return (
      <GameWrapper
        type="private"
        isLoading={isGameLoading}
        changeIsLoading={(state) => setIsGameLoading(state)}
      />
    );
  }

  const bubbleMessage = error ? "침입자?" : "반갑다!";
  const bubbleColor = error ? "#FF4B4B" : "#FFD93D"; // 빨강 / 노랑

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-blue-100 to-blue-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm min-h-[460px] flex flex-col items-center"
      >
        {/* Pawn + 말풍선 */}
        <div className="relative mb-6">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2">
            <div
              className={`relative px-3 py-1 rounded-full shadow-lg font-bold text-sm whitespace-nowrap animate-bounce ${
                error ? "text-white" : "text-black"
              }`}
              style={{ backgroundColor: bubbleColor }}
            >
              {bubbleMessage}
              <div
                className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4"
                style={{
                  borderLeftColor: "transparent",
                  borderRightColor: "transparent",
                  borderTopColor: bubbleColor,
                }}
              />
            </div>
          </div>

          <Pawn
            color={"blue"}
            animation="idle"
            paused={false}
            className="w-[80px] h-[80px]"
          />
        </div>

        <h1 className="text-2xl font-bold text-center mb-4">암호 입력</h1>
        <p className="text-gray-500 text-center mb-6">
          이 섬은 비밀섬이에요 암호가 필요해요
        </p>

        {/* 비밀번호 input + 지우기 버튼 */}
        <div className="w-full relative mb-2">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="암호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
            ref={inputRef}
          />
          {password.length > 0 && (
            <button
              type="button"
              onClick={() => setPassword("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* 비밀번호 보기 체크박스 */}
        <div className="w-full flex items-center mb-4">
          <input
            type="checkbox"
            id="showPassword"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="showPassword" className="text-gray-600 text-sm">
            암호 보기
          </label>
        </div>

        {/* 에러 메시지 */}
        <div className="h-6 mb-4 flex items-center justify-center">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={loading || !password}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "확인 중..." : "입장하기"}
        </button>
      </form>
    </div>
  );
}
