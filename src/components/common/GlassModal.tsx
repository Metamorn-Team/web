import React, { useEffect } from "react";

interface GlassModalProps {
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
  variant?: "frosted" | "crystal" | "mirror" | "tinted";
  blur?: "sm" | "md" | "lg" | "xl";
  opacity?: number;
  border?: boolean;
  shadow?: "sm" | "md" | "lg" | "xl";
  backdropBlur?: "sm" | "md" | "lg" | "xl";
  backdropOpacity?: number;
}

export default function GlassModal({
  children,
  onClose,
  className,
  variant = "frosted",
  blur = "md",
  opacity = 0.15,
  border = true,
  shadow = "lg",
  backdropOpacity = 0.2,
}: GlassModalProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [onClose]);

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
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* 배경 오버레이 */}
      <div
        className={`absolute inset-0`}
        style={{
          backgroundColor: `rgba(0, 0, 0, ${backdropOpacity})`,
        }}
        onClick={onClose}
      />

      {/* 모달 컨테이너 */}
      <div
        className={`
          relative overflow-hidden rounded-2xl
          ${blurClasses[blur]}
          ${shadowClasses[shadow]}
          ${border ? "border" : ""}
          animate-fadeIn
          ${className}
        `}
        style={{
          backgroundColor: currentVariant.background,
          borderColor: currentVariant.borderColor,
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
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
}
