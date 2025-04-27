import RetroModal from "@/components/common/RetroModal";
import { EquippedItem } from "@/types/client/product";
import React, { useEffect, useState } from "react";

interface ConfirmPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: () => void;
  onCharge: () => void;
  equippedItems: EquippedItem[];
  goldBalance: number;
}

const ConfirmPurchaseModal = ({
  isOpen,
  onClose,
  onPurchase,
  onCharge,
  equippedItems,
  goldBalance,
}: ConfirmPurchaseModalProps) => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [isEnoughGold, setIsEnoughGold] = useState(true);

  useEffect(() => {
    setIsEnoughGold(goldBalance > totalPrice);
  }, [goldBalance, totalPrice]);

  useEffect(() => {
    setTotalPrice(equippedItems.reduce((total, item) => total + item.price, 0));
  }, [equippedItems]);

  return (
    <RetroModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={isEnoughGold ? onPurchase : onCharge}
      title="구매 확인"
      confirmText={isEnoughGold ? "구매" : "충전"}
      cancelText="취소"
    >
      <div className="space-y-4">
        <ul className="space-y-2 text-sm text-[#5c4b32]">
          {equippedItems.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center bg-[#f3e9d0] p-2 rounded-lg shadow-md hover:bg-[#f1e0c2] transition-all"
            >
              <p className="text-base">{item.name}</p>
              <p className="font-semibold text-base">
                {item.price.toLocaleString()} G
              </p>
            </li>
          ))}
        </ul>
        <div className="text-center text-lg font-bold text-[#a27c3f]">
          <p className="text-xl font-bold text-[#8c7a5c]">
            총 {totalPrice.toLocaleString()} G
          </p>

          <p
            className={`text-xl font-bold mt-4 ${
              isEnoughGold ? "text-[#e4a945]" : "text-red-500"
            }`}
          >
            {isEnoughGold
              ? `구매 후 잔액: ${(goldBalance - totalPrice).toLocaleString()} G`
              : "골드가 부족해요!"}
          </p>
        </div>
      </div>
    </RetroModal>
  );
};

export default ConfirmPurchaseModal;
