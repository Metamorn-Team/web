import React from "react";

interface GlassButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "auto";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  hover?: boolean;
  blur?: "sm" | "md" | "lg";
  opacity?: number;
  timeOfDay?: string;
}

export default function GlassButton({
  children,
  onClick,
  className = "",
  variant = "auto",
  size = "md",
  disabled = false,
  hover = true,
  blur = "md",
  opacity = 0.15,
  timeOfDay = "afternoon",
}: GlassButtonProps) {
  const blurClasses = {
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  // 시간대별 자동 색상 설정
  const getAutoVariant = () => {
    switch (timeOfDay) {
      case "dawn":
        return {
          background: `rgba(255, 216, 155, ${opacity})`,
          borderColor: "rgba(25, 84, 123, 0.4)",
          textColor: "text-yellow-900",
          hoverBg: `rgba(255, 216, 155, ${opacity + 0.1})`,
          gradient:
            "bg-gradient-to-br from-yellow-200/30 via-transparent to-yellow-100/20",
        };
      case "morning":
        return {
          background: `rgba(168, 192, 255, ${opacity})`,
          borderColor: "rgba(168, 192, 255, 0.4)",
          textColor: "text-blue-900",
          hoverBg: `rgba(168, 192, 255, ${opacity + 0.1})`,
          gradient:
            "bg-gradient-to-br from-blue-200/30 via-transparent to-blue-100/20",
        };
      case "afternoon":
        return {
          background: `rgba(249, 245, 236, ${opacity})`,
          borderColor: "rgba(232, 213, 196, 0.4)",
          textColor: "text-amber-900",
          hoverBg: `rgba(249, 245, 236, ${opacity + 0.1})`,
          gradient:
            "bg-gradient-to-br from-amber-200/30 via-transparent to-amber-100/20",
        };
      case "evening":
        return {
          background: `rgba(255, 236, 210, ${opacity})`,
          borderColor: "rgba(252, 182, 159, 0.4)",
          textColor: "text-orange-900",
          hoverBg: `rgba(255, 236, 210, ${opacity + 0.1})`,
          gradient:
            "bg-gradient-to-br from-orange-200/30 via-transparent to-orange-100/20",
        };
      case "night":
        return {
          background: `rgba(44, 62, 80, ${opacity})`,
          borderColor: "rgba(52, 73, 94, 0.4)",
          textColor: "text-gray-100",
          hoverBg: `rgba(44, 62, 80, ${opacity + 0.1})`,
          gradient:
            "bg-gradient-to-br from-gray-300/20 via-transparent to-gray-200/10",
        };
      default:
        return {
          background: `rgba(249, 245, 236, ${opacity})`,
          borderColor: "rgba(232, 213, 196, 0.4)",
          textColor: "text-amber-900",
          hoverBg: `rgba(249, 245, 236, ${opacity + 0.1})`,
          gradient:
            "bg-gradient-to-br from-amber-200/30 via-transparent to-amber-100/20",
        };
    }
  };

  const variantStyles = {
    primary: {
      background: `rgba(59, 130, 246, ${opacity})`,
      borderColor: "rgba(59, 130, 246, 0.3)",
      textColor: "text-blue-900",
      hoverBg: `rgba(59, 130, 246, ${opacity + 0.1})`,
      gradient:
        "bg-gradient-to-br from-blue-400/20 via-transparent to-blue-300/10",
    },
    secondary: {
      background: `rgba(107, 114, 128, ${opacity})`,
      borderColor: "rgba(107, 114, 128, 0.3)",
      textColor: "text-gray-800",
      hoverBg: `rgba(107, 114, 128, ${opacity + 0.1})`,
      gradient:
        "bg-gradient-to-br from-gray-400/20 via-transparent to-gray-300/10",
    },
    ghost: {
      background: `rgba(255, 255, 255, ${opacity * 0.5})`,
      borderColor: "rgba(255, 255, 255, 0.2)",
      textColor: "text-gray-700",
      hoverBg: `rgba(255, 255, 255, ${opacity * 0.8})`,
      gradient: "bg-gradient-to-br from-white/10 via-transparent to-white/5",
    },
    danger: {
      background: `rgba(239, 68, 68, ${opacity})`,
      borderColor: "rgba(239, 68, 68, 0.3)",
      textColor: "text-red-900",
      hoverBg: `rgba(239, 68, 68, ${opacity + 0.1})`,
      gradient:
        "bg-gradient-to-br from-red-400/20 via-transparent to-red-300/10",
    },
    auto: getAutoVariant(),
  };

  const currentVariant = variantStyles[variant];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative overflow-hidden rounded-lg border font-semibold font-medium
        ${blurClasses[blur]}
        ${sizeClasses[size]}
        ${currentVariant.textColor}
        ${
          hover && !disabled
            ? "transition-all duration-300 hover:scale-105 hover:shadow-lg"
            : ""
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
      style={{
        backgroundColor: disabled
          ? currentVariant.background.replace(/[\d.]+\)/, "0.05)")
          : currentVariant.background,
        borderColor: currentVariant.borderColor,
        ...(hover &&
          !disabled && {
            "&:hover": {
              backgroundColor: currentVariant.hoverBg,
              transform: "scale(1.05)",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
            },
          }),
      }}
    >
      {/* 유리 반사 효과 */}
      <div
        className={`absolute inset-0 ${currentVariant.gradient} pointer-events-none`}
      />

      {/* 추가적인 빛나는 효과 */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />

      {/* 내부 컨텐츠 */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
}
