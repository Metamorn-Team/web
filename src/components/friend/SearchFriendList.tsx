"use client";

import React, { useEffect, useState } from "react";
import ScrollView from "@/components/common/ScrollView";
import SquareButton from "@/components/common/SquareButton";
import { useInfiniteUserSearch } from "@/hook/queries/useInfiniteUserSearch";
import SearchUserItem from "@/components/friend/SearchUserItem";
import { socketManager } from "@/game/managers/socket-manager";
import { SOCKET_NAMESPACES } from "@/constants/socket/namespaces";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY as USER_SEARCH_QUERY_KEY } from "@/hook/queries/useInfiniteUserSearch";
import { SearchVarient } from "mmorntype/dist/src/domain/types/uesr.types";
import { SearchUserResponse } from "mmorntype";
import { FriendRequestStatus } from "mmorntype/dist/src/presentation/dto/shared";

const SearchFriendList = () => {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<SearchVarient>("NICKNAME");
  const types = ["NICKNAME", "TAG"] as const;

  const {
    users,
    isLoading,
    isError,
    fetchNextPage,
    refetch,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteUserSearch(query, searchType, 10);

  const onSuccess = (targetId: string, status: FriendRequestStatus) =>
    queryClient.setQueryData<InfiniteData<SearchUserResponse>>(
      [USER_SEARCH_QUERY_KEY, query, searchType], // query/searchType은 상태에서 가져와야 함
      (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.map((user) =>
              user.id === targetId ? { ...user, friendStatus: status } : user
            ),
          })),
        };
      }
    );

  useEffect(() => {
    const socket = socketManager.connect(SOCKET_NAMESPACES.ISLAND);
    const handleFriendRequestSuccess = (data: { targetUserId: string }) => {
      onSuccess(data.targetUserId, "SENT");
    };

    socket?.on("sendFriendRequestSuccess", handleFriendRequestSuccess);

    return () => {
      socket?.off("sendFriendRequestSuccess", handleFriendRequestSuccess);
    };
  }, [query, searchType, queryClient]);

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex justify-center gap-2 mt-2 px-4">
        {types.map((type) => {
          const isActive = searchType === type;
          return (
            <button
              key={type}
              onClick={() => setSearchType(type)}
              className={`px-4 py-1 border text-sm font-bold transition
          ${
            isActive
              ? "bg-[#5c4b32] text-white border-[#3d2c1b] shadow-[2px_2px_0_#3d2c1b]"
              : "bg-[#fdf8ef] text-[#5c4b32] border-[#bfae96] hover:bg-[#f3ece1]"
          }
          rounded-md`}
            >
              {type === "NICKNAME" ? "닉네임" : "태그"}
            </button>
          );
        })}
      </div>

      {/* 검색 입력 영역 */}
      <div className="flex sticky top-0 z-10 w-full justify-center">
        <div className="flex w-full gap-2 justify-center">
          <input
            type="text"
            placeholder={`${
              searchType === "NICKNAME" ? "닉네임으" : "태그"
            }로 검색`}
            value={query}
            onKeyUp={(e) => e.key === "Enter" && refetch()}
            onChange={(e) => setQuery(e.target.value)}
            className="h-12 px-4 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 flex-1 max-w-[260px]"
          />
          <SquareButton
            onClick={refetch}
            color="blue"
            width={48}
            title="검색"
          />
        </div>
      </div>

      {/* 검색 결과 영역 */}
      <div className="flex-1 min-h-0 w-full">
        <ScrollView className="h-full">
          {isLoading ? (
            <p className="text-center text-sm mt-4">검색 중...</p>
          ) : isError ? (
            <p className="text-center text-sm text-red-500 mt-4">
              검색 중 오류 발생
            </p>
          ) : users && users.length > 0 ? (
            <>
              {users.map((user) => (
                <SearchUserItem
                  key={user.id}
                  user={{
                    ...user,
                    profileImageUrl: `/images/avatar/${user.avatarKey}.png`,
                  }}
                  onSuccess={onSuccess}
                />
              ))}
              {isFetchingNextPage && (
                <p className="text-center text-sm text-gray-500 py-2">
                  더 불러오는 중...
                </p>
              )}
              {hasNextPage && !isFetchingNextPage && (
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
              검색 결과가 없습니다.
            </p>
          )}
        </ScrollView>
      </div>
    </div>
  );
};

export default React.memo(SearchFriendList);
