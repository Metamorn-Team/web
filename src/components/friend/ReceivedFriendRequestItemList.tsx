import ScrollView from "@/components/common/ScrollView";
import FriendRequestItem from "@/components/friend/FriendRequestItem";
import { FriendRequest } from "@/types/client/friend.types";
import React from "react";

interface ReceivedFriendRequestItemListProps {
  users: FriendRequest[];
}

export default function ReceivedFriendRequestItemList({
  users,
}: ReceivedFriendRequestItemListProps) {
  return (
    <ScrollView>
      {users.map((user) => (
        <FriendRequestItem key={user.id} user={user} status={"RECEIVED"} />
      ))}
    </ScrollView>
  );
}
