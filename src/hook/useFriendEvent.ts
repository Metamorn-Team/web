import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { SOCKET_NAMESPACES } from "@/constants/socket/namespaces";
import { socketManager } from "@/game/managers/socket-manager";
import { QUERY_KEY as UNREAD_COUNT_QUERY_KEY } from "@/hook/queries/useGetUnreadFriendRequest";
import { QUERY_KEY as ISLAND_INFO_QUERY_KEY } from "@/hook/queries/useGetIslandInfo";

export const useFriendEvent = () => {
  const queryClient = useQueryClient();
  const [showNewRequestMessage, setShowNewRequestMessage] = useState(false);

  useEffect(() => {
    const socket = socketManager.connect(SOCKET_NAMESPACES.ISLAND);

    const handleReceiveFriendRequest = () => {
      const prev = queryClient.getQueryData<{ count: number }>([
        UNREAD_COUNT_QUERY_KEY,
      ]);

      if (prev && typeof prev.count === "number") {
        queryClient.setQueryData([UNREAD_COUNT_QUERY_KEY], {
          count: prev.count + 1,
        });
      } else {
        queryClient.setQueryData([UNREAD_COUNT_QUERY_KEY], { count: 1 });
      }

      setShowNewRequestMessage(true);
      setTimeout(() => setShowNewRequestMessage(false), 5000);
    };

    const hadleIslandInfoUpdated = (data: { islandId: string }) => {
      queryClient.invalidateQueries({
        queryKey: [ISLAND_INFO_QUERY_KEY, data.islandId],
      });
    };

    socket?.on("receiveFriendRequest", handleReceiveFriendRequest);
    socket?.on("islandInfoUpdated", hadleIslandInfoUpdated);

    return () => {
      socket?.off("receiveFriendRequest");
      socket?.off("islandInfoUpdated");
    };
  }, []);

  return {
    showNewRequestMessage,
  };
};
