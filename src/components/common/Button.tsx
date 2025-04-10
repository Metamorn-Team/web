import { FontSize } from "@/types/style/font.type";

interface ButtonProps {
  title: string;
  width: string;
  color: "yellow";
  onClick: () => void;
  disabled?: boolean;
  isSubmitType?: boolean;
  isActive?: boolean;
  fontSize?: FontSize;
  className?: string;
}

const buttonBgs = {
  yellow: "bg-yellowBtn",
};

export default function Button({
  title,
  color,
  onClick,
  disabled = false,
  isSubmitType = false,
  isActive,
  width,
  fontSize = "text-base",
  className,
}: ButtonProps) {
  const styles = isActive
    ? "bg-yellowPressedBtn pb-1"
    : `${buttonBgs[color]} pb-2 active:bg-yellowPressedBtn active:pb-1`;

  return (
    <button
      type={isSubmitType ? "submit" : "button"}
      className={`${styles} ${fontSize} bg-cover bg-no-repeat flex justify-center items-center ${className}`}
      style={{
        aspectRatio: "3/1",
        width,
        height: "auto",
      }}
      onClick={onClick}
      disabled={disabled}
    >
      <p>{title}</p>
    </button>
  );
}
