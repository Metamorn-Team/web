import classNames from "classnames";
import Pawn from "./Pawn";

interface LogoProps {
  width: string;
  timeOfDay?: string;
  textColor?: string;
  className?: string;
}

export const Logo = ({
  width,
  timeOfDay = "afternoon",
  textColor,
  className,
}: LogoProps) => {
  // 시간대별 Pawn 색상 매핑
  const getPawnColor = (timeOfDay: string) => {
    switch (timeOfDay) {
      case "dawn":
        return "blue";
      case "morning":
        return "yellow";
      case "afternoon":
        return "purple";
      case "evening":
        return "orange";
      case "night":
        return "pure_shadow";
      default:
        return "blue";
    }
  };

  const pawnColor = getPawnColor(timeOfDay);

  return (
    <div
      className={classNames(
        "flex flex-col justify-center items-center transition-all duration-1000",
        className
      )}
      style={{ width }}
    >
      <div className="mb-2">
        <Pawn
          color={pawnColor}
          animation="idle"
          className="w-12 h-12 transition-all duration-1000"
        />
      </div>
      <p
        className="text-3xl font-bold transition-colors duration-1000"
        style={{ color: textColor }}
      >
        리브아일랜드
      </p>
    </div>
  );
};

export default Logo;
