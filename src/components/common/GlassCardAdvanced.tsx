import React from "react";

interface GlassCardAdvancedProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  variant?: "frosted" | "crystal" | "mirror" | "tinted";
  blur?: "sm" | "md" | "lg" | "xl";
  opacity?: number;
  border?: boolean;
  shadow?: "sm" | "md" | "lg" | "xl";
  hover?: boolean;
}

export default function GlassCardAdvanced({
  children,
  className,
  style,
  variant = "frosted",
  blur = "md",
  opacity = 0.15,
  border = true,
  shadow = "lg",
  hover = false,
}: GlassCardAdvancedProps) {
  const blurClasses = {
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
    xl: "backdrop-blur-xl",
  };

  const shadowClasses = {
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
  };

  const variantStyles = {
    frosted: {
      background: `rgba(255, 255, 255, ${opacity})`,
      borderColor: "rgba(255, 255, 255, 0.2)",
      gradient: "bg-gradient-to-br from-white/10 via-transparent to-white/5",
    },
    crystal: {
      background: `rgba(255, 255, 255, ${opacity * 0.8})`,
      borderColor: "rgba(255, 255, 255, 0.3)",
      gradient:
        "bg-gradient-to-br from-white/20 via-transparent to-cyan-100/10",
    },
    mirror: {
      background: `rgba(255, 255, 255, ${opacity * 0.6})`,
      borderColor: "rgba(255, 255, 255, 0.4)",
      gradient: "bg-gradient-to-br from-white/30 via-transparent to-white/10",
    },
    tinted: {
      background: `rgba(147, 197, 253, ${opacity * 0.8})`,
      borderColor: "rgba(147, 197, 253, 0.3)",
      gradient:
        "bg-gradient-to-br from-blue-200/20 via-transparent to-blue-100/10",
    },
  };

  const currentVariant = variantStyles[variant];

  return (
    <div
      className={`
        relative overflow-hidden rounded-xl
        ${blurClasses[blur]}
        ${shadowClasses[shadow]}
        ${border ? "border" : ""}
        ${
          hover
            ? "transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            : ""
        }
        ${className}
      `}
      style={{
        backgroundColor: currentVariant.background,
        borderColor: currentVariant.borderColor,
        ...style,
      }}
    >
      {/* 유리 반사 효과 */}
      <div
        className={`absolute inset-0 ${currentVariant.gradient} pointer-events-none`}
      />

      {/* 추가적인 빛나는 효과 (crystal과 mirror 변형용) */}
      {(variant === "crystal" || variant === "mirror") && (
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
      )}

      {/* 내부 컨텐츠 */}
      <div className="relative z-10 p-2">{children}</div>
    </div>
  );
}
