import { PrivateIslandItem } from "mmorntype";
import IslandCard from "./IslandCard";
import Alert from "@/utils/alert";
import { getBackgroundStyle } from "@/styles/time-of-date-style";
import { TimeOfDay } from "@/utils/date";

interface IslandCardListProps {
  islands: PrivateIslandItem[];
  timeOfDay: string;
}

export default function IslandCardList({
  islands,
  timeOfDay,
}: IslandCardListProps) {
  const backgroundStyle = getBackgroundStyle(timeOfDay as TimeOfDay);

  const handleShareLink = (shareLink: string) => {
    navigator.clipboard.writeText(shareLink);
    Alert.info("링크가 클립보드에 복사되었습니다!");
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
      {islands.map((island) => (
        <IslandCard
          key={island.id}
          island={island}
          backgroundStyle={backgroundStyle}
          onShareLink={handleShareLink}
          timeOfDay={timeOfDay}
        />
      ))}
    </div>
  );
}
