import RetroButton from "@/components/common/RetroButton";
import React from "react";

export interface Category {
  value: string;
  icon: React.ReactNode;
  label: string;
}

interface CategorySelector {
  categories: Category[];
  selectedType: string;
  setSelectedType: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
  hasPromotion?: boolean;
}

const CategorySelector = ({
  categories,
  selectedType,
  setSelectedType,
  className,
  hasPromotion = false,
}: CategorySelector) => {
  return (
    <div
      className={`flex gap-3 mb-4 sticky top-0 z-40 bg-[#f9f5ec] ${className}`}
    >
      {categories
        .filter((category) => {
          if (hasPromotion) {
            return category.value !== "promotion";
          }
          return true;
        })
        .map((category) => (
          <RetroButton
            key={category.value}
            variant="ghost"
            onClick={() => setSelectedType(category.value)}
            className={`flex items-center gap-2 px-4 py-2 border border-[#bfae96] text-sm font-bold shadow-[3px_3px_0_#8c7a5c] transition-all rounded-[4px]
              ${
                selectedType === category.value
                  ? "bg-[#f0e4c3] text-[#2a1f14]"
                  : "bg-[#fcf4e4] text-[#5c4b32] hover:bg-[#f3e9d0]"
              }`}
          >
            <span className="text-lg">{category.icon}</span>
            <span>{category.label}</span>
          </RetroButton>
        ))}
    </div>
  );
};

export default CategorySelector;
