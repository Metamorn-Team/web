import { useGetAllMap } from "@/hook/queries/useGetAllMap";
import Image from "next/image";
import { useEffect } from "react";

interface IslandSelectorProps {
  selectedIslandKey: string;
  onSelect: (key: string) => void;
}

export default function IslandSelector({
  selectedIslandKey,
  onSelect,
}: IslandSelectorProps) {
  const { data: maps } = useGetAllMap();

  useEffect(() => {
    if (maps.length > 0) {
      onSelect(maps[0].key);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maps]);

  return (
    <div>
      <label className="block text-sm font-medium text-[#5c4b32] mt-4 mb-2">
        섬 종류 선택
      </label>
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {maps.map((island) => (
          <div
            key={island.key}
            onClick={() => onSelect(island.key)}
            className={`min-w-[100px] flex-shrink-0 cursor-pointer rounded-lg border-2 ${
              selectedIslandKey === island.key
                ? "border-[#5c4b32]"
                : "border-[#ddd]"
            }`}
          >
            <div className="w-[100px] h-[70px] relative rounded-t-lg overflow-hidden">
              <Image
                src={island.image}
                alt={island.name}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <p className="text-center text-sm p-1">{island.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
