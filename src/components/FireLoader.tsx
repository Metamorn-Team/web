import React from "react";

export default function FireLoader({ className }: { className?: string }) {
  return (
    <div
      className={`w-60 h-60 bg-[url('/images/fire.png')] bg-[length:700%_100%] animate-fire ${className}`}
    />
  );
}
