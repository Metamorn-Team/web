import React from "react";

interface PaperCardProps {
  children: React.ReactNode;
  width?: string | number;
  className?: string;
}

export default function PaperCard({
  children,
  width,
  className,
}: PaperCardProps) {
  return (
    <article
      className={`bg-paperSmall bg-cover flex items-center p-3 ${className}`}
      style={{
        aspectRatio: "3/1",
        width: width || "fit-content",
        height: "auto",
      }}
    >
      {children}
    </article>
  );
}
