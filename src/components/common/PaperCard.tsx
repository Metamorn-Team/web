import React from "react";

interface PaperCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function PaperCard({
  children,
  className,
  style,
}: PaperCardProps) {
  return (
    <article
      className={`bg-cover flex items-center p-3 ${className}`}
      style={{
        height: "auto",
        ...style,
      }}
    >
      {children}
    </article>
  );
}
