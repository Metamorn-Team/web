interface SquareButtonProps {
  title: string;
  color: "blue" | "red";
  onClick: () => void;
  width?: string | number;
  fontSize?: number;
  className?: string;
}

const varients = {
  blue: "bg-squareBlueBtn active:bg-squareBluePressedBtn",
  red: "bg-squareRedBtn active:bg-squareRedPressedBtn",
};

export default function SquareButton({
  title,
  color,
  onClick,
  width,
  fontSize,
  className,
}: SquareButtonProps) {
  return (
    <button
      className={`${varients[color]} bg-cover pb-1 active:pb-0 flex justify-center items-center ${className}`}
      style={{
        aspectRatio: "1/1",
        width: width || "fit-content",
        height: "auto",
        fontSize: fontSize || 14,
      }}
      onClick={onClick}
    >
      <p className="text-center">{title}</p>
    </button>
  );
}
