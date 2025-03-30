import React from "react";

interface RibonProps {
  title: string;
  color: "yellow";
  width: number;
  fontSize?: number;
  paddingBottom?: number;
}

export default function Ribon({
  title,
  color,
  width,
  fontSize,
  paddingBottom,
}: RibonProps) {
  const ribons = {
    yellow: "bg-ribonYellow",
  };

  return (
    <div
      className={`${ribons[color]} bg-cover flex justify-center items-center`}
      style={{
        width,
        height: width / 3,
        fontSize: fontSize || 24,
        paddingBottom: paddingBottom || 12,
      }}
    >
      <p>{title}</p>
    </div>
  );
}
