const ProductCardSkeleton = () => (
  <div
    className="bg-[#fdf8ef] border border-[#bfae96] shadow-[4px_4px_0_#8c7a5c] transition p-4 flex flex-col justify-between gap-2 w-52 rounded-[6px] animate-pulse"
    style={{ aspectRatio: "1/1.3", fontFamily: "'DungGeunMo', sans-serif" }}
  >
    <div className="relative w-full aspect-square overflow-hidden border border-[#d2c4ad] rounded-[4px]">
      <p></p>
    </div>

    <div>
      <div className="h-4 bg-[#d2c4ad] rounded w-3/4 mt-2"></div>
      <div className="h-3 bg-[#d2c4ad] rounded w-5/6 mt-1"></div>
    </div>

    <div className="flex justify-between items-center mt-2">
      <div className="flex gap-2 items-center">
        <div className="h-5 w-5 bg-[#d2c4ad] rounded-full"></div>
        <div className="h-4 bg-[#d2c4ad] rounded w-1/2"></div>
      </div>

      <div className="flex gap-1">
        <button className="px-2 py-1 text-[11px] bg-[#b4a68b] text-[#b4a68b] border border-[#5c4b32] rounded-[2px] shadow-[2px_2px_0_#5c4b32] hover:bg-[#a79b84] transition-all">
          장착
        </button>
        <button className="px-2 py-1 text-[11px] bg-[#b4a68b] text-[#b4a68b] border border-[#5c4b32] rounded-[2px] shadow-[2px_2px_0_#5c4b32] hover:bg-[#a79b84] transition-all">
          구매
        </button>
      </div>
    </div>
  </div>
);

export default ProductCardSkeleton;
