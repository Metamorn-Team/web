import RetroButton from "@/components/common/RetroButton";

interface EquippedItemProps {
  id: string;
  name: string;
  price: number;
  onRemove?: (id: string) => void;
}

const EquippedItemRow = ({ id, name, price, onRemove }: EquippedItemProps) => {
  return (
    <li className="flex justify-between items-center px-3 py-2 bg-[#f5eee0] border border-[#d6c6aa] rounded-[4px] shadow-[2px_2px_0_#c6b89d]">
      <div className="flex flex-col text-xs text-[#4a3928] font-bold leading-snug">
        <span className="">{name}</span>
        <span className="text-[#a27c3f]">{price.toLocaleString()} G</span>
      </div>
      <RetroButton
        onClick={() => onRemove?.(id)}
        className="ml-2 px-[6px] py-[2px] text-[10px]"
        variant="ghost"
      >
        ✕
      </RetroButton>
    </li>
  );
};

export default EquippedItemRow;
