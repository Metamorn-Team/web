"use client";

import { getItem, persistItem } from "@/utils/persistence";
import { useEffect, useState } from "react";

const controls = [
  { keys: ["W", "A", "S", "D"], label: "이동" },
  { keys: ["↑", "↓", "←", "→"], label: "이동 (화살표)" },
  { keys: ["Z"], label: "공격" },
  { keys: ["X"], label: "강공격" },
  { keys: ["Space"], label: "점프" },
  { keys: ["E"], label: "상호작용" },
];

export default function ControlGuide() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seen = getItem("seen_control_guide");
    if (!seen) {
      const timeout = setTimeout(() => {
        setVisible(true);
        persistItem("seen_control_guide", true);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, []);

  const handleClose = () => setVisible(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-45 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white/10 border border-white/30 rounded-xl p-6 max-w-[500px] w-full text-white text-center shadow-lg animate-fadeIn">
        <h2 className="text-lg font-bold mb-4">🎮 조작 방법 안내</h2>
        <ul className="flex flex-col gap-3 text-sm">
          {controls.map(({ keys, label }) => (
            <li key={label} className="flex items-center justify-between px-4">
              <div className="flex gap-1 flex-wrap justify-center">
                {keys.map((key) => (
                  <kbd
                    key={key}
                    className="px-2 py-1 border border-white/50 rounded bg-white/10 text-white text-sm shadow"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
              <span className="text-base text-white/80">{label}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={handleClose}
          className="mt-6 px-4 py-2 text-sm text-white bg-white/20 border border-white/30 rounded hover:bg-white/30 transition-all"
        >
          알겠습니다 (ESC)
        </button>
      </div>
    </div>
  );
}
