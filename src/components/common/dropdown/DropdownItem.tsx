export default function DropdownItem({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string | React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-2 py-1 text-sm text-[#5c4b32] border border-transparent hover:border-[#bfae96] hover:bg-[#f8f1e4] transition-all rounded-[4px]"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
