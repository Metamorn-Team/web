import { FontSize } from "@/types/style/font.type";

interface ButtonProps {
  title: string;
  width: number;
  color: "yellow";
  onClick: () => void;
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
  isActive,
  width,
  fontSize = "text-base",
}: ButtonProps) {
  const styles = isActive
    ? "bg-yellowPressedBtn pb-1"
    : `${buttonBgs[color]} pb-2`;

  return (
    <button
      className={`${styles} ${fontSize} bg-cover bg-no-repeat flex justify-center items-center`}
      style={{
        aspectRatio: "3/1",
        width,
        height: "auto",
      }}
      onClick={onClick}
    >
      <p>{title}</p>
    </button>
  );
}
