import ScrollView from "@/components/common/ScrollView";
import FriendItem from "@/components/FriendItem";
import { Friend } from "@/types/client/friend.types";

interface FriendItemListProps {
  friends: Friend[];
  className?: string;
}

export default function FriendItmeList({
  friends,
  className,
}: FriendItemListProps) {
  return (
    <ScrollView className={className}>
      {friends.map((friend) => (
        <FriendItem key={friend.id} friend={friend} />
      ))}
    </ScrollView>
  );
}
