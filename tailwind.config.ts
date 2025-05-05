import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#353A4B",
        background: "var(--background)",
        foreground: "var(--foreground)",
        google: "#FFFFFF",
        kakao: "#FFCD00",
        kakaoHover: "#F2B900",
        kakaoText: "#3E1C00",
        naver: "#1EC800",
        naverHover: "#1A9A00",
      },
      backgroundImage: {
        homeBg: "url(/images/background.png)",
        modalBg: "url(/images/ui/paper.png)",
        paperBg: "url(/images/ui/paper-bg.png)",
        paperLongBg: "url(/images/ui/paper-long.png)",
        paperSmall: "url(/images/ui/paper-small.png)",
        yellowBtn: "url(/images/ui/button-yellow.png)",
        yellowPressedBtn: "url(/images/ui/button-yellow-pressed.png)",
        ribonYellow: "url(/images/ui/ribon-yellow.png)",
        squareBlueBtn: "url(/images/ui/square-blue.png)",
        squareBluePressedBtn: "url(/images/ui/square-blue-pressed.png)",
        squareRedBtn: "url(/images/ui/square-red.png)",
        squareRedPressedBtn: "url(/images/ui/square-red-pressed.png)",
      },
      fontSize: {
        xs: "0.75rem", // 12px
        sm: "0.875rem", // 14px
        base: "1rem", // 16px
        lg: "1.125rem", // 18px
        xl: "1.25rem", // 20px
        "2xl": "1.5rem", // 24px
        "3xl": "1.875rem", // 30px
        "4xl": "2.25rem", // 36px
        "5xl": "3rem", // 48px
        "6xl": "4rem", // 64px
      },
      fontWeight: {
        thin: "100",
        extralight: "200",
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
        black: "900",
      },
      animation: {
        fire: "fireAnim 0.6s steps(7) infinite",
        goblinTorch: "goblinTorchAnim 0.6s step(7) infinite",
        pawn: "pawnAnim 0.6s steps(6) infinite",
        fadeIn: "fadeIn 0.3s",
        spinOnce: "spinOnce 0.7s ease-in-out",
      },
      keyframes: {
        fireAnim: {
          from: { backgroundPosition: "0% 0" },
          to: { backgroundPosition: "-700% 0" },
        },
        goblinTorchAnim: {
          from: { backgroundPosition: "0% 40%" },
          to: { backgroundPosition: "-700% 40%" },
        },
        fadeIn: {
          from: { opacity: "0.5", transform: "translateY(-10px)" },
          to: { opacity: "1", transform: "translateY(0px)" },
        },
        pawnAnim: {
          from: { backgroundPosition: "0% 0%" },
          to: { backgroundPosition: "-600% 0%" },
        },
        spinOnce: {
          from: {
            transform: "rotate(0deg)",
          },
          to: {
            transform: "rotate(-360deg)",
          },
        },
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwind-scrollbar-hide")],
} satisfies Config;
