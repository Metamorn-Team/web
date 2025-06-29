export type Provider = "GOOGLE" | "KAKAO";

// 카카오 SDK 타입 정의
declare global {
  interface Window {
    Kakao: {
      init: (appKey: string) => void;
      isInitialized: () => boolean;
      Auth: {
        login: (options: {
          success: (authObj: { access_token: string }) => void;
          fail: (err: Error) => void;
        }) => void;
        loginForm: (options: {
          success: (authObj: { access_token: string }) => void;
          fail: (err: Error) => void;
        }) => void;
        logout: () => void;
      };
    };
  }
}
