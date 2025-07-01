import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  blur?: "sm" | "md" | "lg";
  opacity?: number;
}

export default function GlassCard({
  children,
  className,
  style,
  blur = "md",
  opacity = 0.1,
}: GlassCardProps) {
  const blurClasses = {
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
  };

  return (
    <div
      className={`relative overflow-hidden rounded-lg border border-white/20 shadow-lg ${blurClasses[blur]} ${className}`}
      style={{
        backgroundColor: `rgba(255, 255, 255, ${opacity})`,
        ...style,
      }}
    >
      {/* 유리 반사 효과 */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 pointer-events-none" />

      {/* 내부 컨텐츠 */}
      <div className="relative z-10 p-4">{children}</div>
    </div>
  );
}
