import { useState, useEffect } from "react";
import { getItem } from "@/utils/persistence";
import { getMyProfile } from "@/api/user";

interface UseIsLoginedReturn {
  isLogined: boolean;
  isLoading: boolean;
}

export const useIsLogined = (): UseIsLoginedReturn => {
  const [isLogined, setIsLogined] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const accessToken = getItem("access_token");

        if (!accessToken) {
          setIsLogined(false);
          setIsLoading(false);
          return;
        }

        try {
          await getMyProfile();
          setIsLogined(true);
        } catch {
          setIsLogined(false);
        }
      } catch (error) {
        console.error("로그인 상태 확인 중 오류:", error);
        setIsLogined(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  return { isLogined, isLoading };
};
