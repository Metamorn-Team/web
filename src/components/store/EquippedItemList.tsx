import EquippedItemRow from "@/components/store/EquippedItemRow";
import { EquippedItem } from "@/types/client/product";
import React from "react";

interface EquippedItemListProps {
  equippedItems: EquippedItem[];
  onEquippedItemRemove: (itemId: string) => void;
}

const EquippedItemList = ({
  equippedItems,
  onEquippedItemRemove,
}: EquippedItemListProps) => {
  return (
    <ul className="text-xs text-[#5c4b32] leading-snug space-y-1">
      {equippedItems.length === 0 ? (
        <p>마음껏 장착해봐요!</p>
      ) : (
        equippedItems.map((item) => (
          <EquippedItemRow
            key={item.id}
            id={item.id}
            name={item.name}
            price={item.price}
            onRemove={() => onEquippedItemRemove(item.id)}
          />
        ))
      )}
    </ul>
  );
};

export default EquippedItemList;
