import React from "react";

interface ScrollViewProps {
  children: React.ReactNode;
  className?: string;
}

const ScrollView = ({ children, className }: ScrollViewProps) => {
  return (
    <div
      className={`flex flex-col items-center w-full overflow-scroll scrollbar-hide ${className}`}
    >
      {children}
    </div>
  );
};

export default ScrollView;
