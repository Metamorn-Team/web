import React from "react";

const FireLoader = ({ className }: { className?: string }) => {
  return (
    <div
      className={`w-60 h-60 bg-[url('/images/fire.png')] bg-[length:700%_100%] animate-fire ${className}`}
    />
  );
};

export default React.memo(FireLoader);
