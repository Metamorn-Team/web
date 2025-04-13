"use client";

import React, { useState } from "react";
import ScrollView from "@/components/common/ScrollView";
import SquareButton from "@/components/common/SquareButton";
import { useInfiniteUserSearch } from "@/hook/queries/useInfiniteUserSearch";
import SearchUserItem from "@/components/friend/SearchUserItem";

type SearchType = "NICKNAME" | "TAG";

const SearchFriendList = () => {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("NICKNAME");
  const types = ["NICKNAME", "TAG"] as const;

  const {
    users,
    isLoading,
    isError,
    fetchNextPage,
    refetch,
    isFetchingNextPage,
  } = useInfiniteUserSearch(query, searchType, 10);

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex justify-center gap-2 mt-2 px-4">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => setSearchType(type)}
            className={`px-4 py-1 rounded-full border text-sm transition ${
              searchType === type
                ? "bg-[#d6c6aa] text-white border-[#b5a183]"
                : "bg-[#f3ece1] text-[#5c4b32] border-[#d6c6aa] hover:bg-[#e8e0d0]"
            }`}
          >
            {type === "NICKNAME" ? "닉네임" : "태그"}
          </button>
        ))}
      </div>

      {/* 검색 입력 영역 */}
      <div className="flex sticky top-0 z-10 w-full justify-center">
        <div className="flex w-9/12 gap-2">
          <input
            type="text"
            placeholder={`${
              searchType === "NICKNAME" ? "닉네임" : "태그"
            }으로 검색`}
            value={query}
            onKeyUp={(e) => e.key === "Enter" && refetch()}
            onChange={(e) => setQuery(e.target.value)}
            className="h-12 px-4 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 flex-1"
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
                  friend={{
                    ...user,
                    profileImageUrl: `/images/avatar/${user.avatarKey}.png`,
                  }}
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
              검색 결과가 없습니다.
            </p>
          )}
        </ScrollView>
      </div>
    </div>
  );
};

export default React.memo(SearchFriendList);
