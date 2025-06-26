import { getItem, persistItem } from "@/utils/persistence";
import { useEffect, useState } from "react";

export default function MobileWarningBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isMobile =
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) &&
      window.innerWidth < 768;
    const dismissed = getItem("seen_mobile_warning");

    console.log(isMobile, dismissed);
    if (isMobile && !dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    persistItem("seen_mobile_warning", true);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm p-2 px-4 flex justify-between items-center mt-14 shadow-sm fixed top-0 left-0 w-full z-50">
      <span className="text-xs">
        리브아일랜드는 PC에서 더 편하게 즐길 수 있어요.
      </span>
      <button onClick={handleDismiss} className="ml-4 text-xs underline">
        다시 보지 않기
      </button>
    </div>
  );
}
