import { FriendRequestDirection } from "@/api/friend";
import ScrollView from "@/components/common/ScrollView";
import FriendRequestItem from "@/components/friend/FriendRequestItem";
import { useInfiniteGetFriendRequests } from "@/hook/queries/useInfiniteGetFriendRequests";
import React from "react";

const ReceivedFriendRequestItemList = () => {
  const {
    friendRequests,
    isLoading,
    isError,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteGetFriendRequests({
    direction: FriendRequestDirection.RECEIVED,
    limit: 10,
  });

  return (
    <ScrollView>
      {isLoading ? (
        <p className="text-center text-sm mt-4">불러오는 중...</p>
      ) : isError ? (
        <p className="text-center text-sm text-red-500 mt-4">오류 발생</p>
      ) : friendRequests && friendRequests.length > 0 ? (
        <>
          {friendRequests.map((request) => (
            <FriendRequestItem
              key={request.id}
              user={{
                ...request.user,
                profileImageUrl: `/images/avatar/${request.user.avatarKey}.png`,
              }}
              status={"RECEIVED"}
            />
          ))}
          {isFetchingNextPage && (
            <p className="text-center text-sm text-gray-500 py-2">
              더 불러오는 중...
            </p>
          )}
          {!isFetchingNextPage && (
            <button
              onClick={() => fetchNextPage()}
              className="w-full text-sm text-blue-500 py-2"
            >
              더 보기
            </button>
          )}
        </>
      ) : (
        <p className="text-sm text-center text-gray-500 mt-4">
          대기 중인 요청이 없어요
        </p>
      )}
    </ScrollView>
  );
};

export default React.memo(ReceivedFriendRequestItemList);
