import React from "react";

interface CardProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  className,
  children,
}) => {
  return <div className={`bg-white rounded-xl p-4 ${className}`}>{children}</div>;
};

export default Card;
