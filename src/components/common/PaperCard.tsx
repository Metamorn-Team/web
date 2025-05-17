import React from "react";

interface PaperCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function PaperCard({ children, className }: PaperCardProps) {
  return (
    <article
      className={`bg-cover flex items-center p-3 ${className}`}
      style={{
        height: "auto",
      }}
    >
      {children}
    </article>
  );
}
