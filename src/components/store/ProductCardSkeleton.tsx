import RetroButton from "@/components/common/RetroButton";

const ProductCardSkeleton = () => (
  <div
    className="bg-[#fdf8ef] border border-[#bfae96] shadow-[4px_4px_0_#8c7a5c] transition p-4 flex flex-col justify-between gap-2 w-52 rounded-[6px] animate-pulse"
    style={{ aspectRatio: "1/1.3", fontFamily: "'DungGeunMo', sans-serif" }}
  >
    <div className="relative w-full aspect-square overflow-hidden border border-[#d2c4ad] rounded-[4px]">
      <p></p>
    </div>

    <div>
      <div className="bg-[#d2c4ad] rounded w-3/4 text-base font-bold text-transparent">
        상품 이름
      </div>
      <div className="text-xs text-transparent bg-[#d2c4ad] rounded w-5/6 mt-1">
        상품 설명
      </div>
    </div>

    <div className="flex justify-between items-center mt-2">
      <div className="flex gap-2 items-center">
        <div className="h-5 w-5 bg-[#d2c4ad] rounded-full text-transparent">
          돈
        </div>
        <div className="h-4 bg-[#d2c4ad] rounded w-1/2 text-transparent">
          200
        </div>
      </div>

      <div className="flex gap-1">
        <RetroButton>
          <p className="text-transparent">장착</p>
        </RetroButton>
        <RetroButton>
          <p className="text-transparent">구매</p>
        </RetroButton>
      </div>
    </div>
  </div>
);

export default ProductCardSkeleton;
