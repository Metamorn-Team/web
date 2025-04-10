import ScrollView from "@/components/common/ScrollView";
import FriendItem from "@/components/FriendItem";
import { Friend } from "@/types/client/friend.types";

interface FriendItemListProps {
  users: Friend[];
  className?: string;
}

export default function FriendItmeList({
  users,
  className,
}: FriendItemListProps) {
  return (
    <ScrollView className={className}>
      {users.map((user) => (
        <FriendItem key={user.id} friend={user} />
      ))}
    </ScrollView>
  );
}
