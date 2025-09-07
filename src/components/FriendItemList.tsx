import ScrollView from "@/components/common/ScrollView";
import FriendItem from "@/components/FriendItem";
import { PAWN_AVATAR_URL } from "@/constants/image-path";
import { useInfiniteGetFriends } from "@/hook/queries/useInfiniteGetFriends";

interface FriendItemListProps {
  className?: string;
}

export default function FriendItmeList({ className }: FriendItemListProps) {
  const {
    friends,
    fetchNextPage,
    isError,
    isFetchingNextPage,
    isLoading,
    hasNextPage,
  } = useInfiniteGetFriends({ limit: 10 });

  return (
    <ScrollView className={className}>
      {isLoading ? (
        <p className="text-center text-sm mt-4">불러오는 중...</p>
      ) : isError ? (
        <p className="text-center text-sm text-red-500 mt-4">오류 발생</p>
      ) : friends && friends.length > 0 ? (
        <>
          {friends.map((friendship) => (
            <FriendItem
              key={friendship.id}
              friend={{
                ...friendship,
                profileImageUrl: PAWN_AVATAR_URL(friendship.avatarKey),
              }}
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
          섬으로 떠나 친구를 만들어봐요! 🏝️
        </p>
      )}
    </ScrollView>
  );
}
