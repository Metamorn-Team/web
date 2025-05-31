import classNames from "classnames";
import { useEffect, useState } from "react";

interface DotLoaderProps {
  loadingText: string;
  className?: string;
}

export const DotLoader = ({ loadingText, className }: DotLoaderProps) => {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 4 ? prev + "." : "."));
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <p className={classNames("text-4xl text-white font-bold mt-4", className)}>
      {loadingText}
      {dots}
    </p>
  );
};
