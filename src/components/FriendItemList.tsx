import ScrollView from "@/components/common/ScrollView";
import FriendItem from "@/components/FriendItem";

interface FriendItemListProps {
  className?: string;
}

export default function FriendItmeList({ className }: FriendItemListProps) {
  return (
    <ScrollView className={className}>
      {friends.map((user) => (
        <FriendItem key={user.id} friend={user} />
      ))}
    </ScrollView>
  );
}

const friends = [
  {
    id: "1",
    profileImageUrl: "/images/slime.png",
    tag: "magik",
    nickname: "매직",
  },
  {
    id: "2",
    profileImageUrl: "/images/slime.png",
    tag: "snai",
    nickname: "달패이",
  },
  {
    id: "3",
    profileImageUrl: "/images/slime.png",
    tag: "kokiri",
    nickname: "코기리",
  },
  {
    id: "4",
    profileImageUrl: "/images/slime.png",
    tag: "kokiri",
    nickname: "코기리",
  },
  {
    id: "5",
    profileImageUrl: "/images/slime.png",
    tag: "kokiri",
    nickname: "코기리",
  },
  {
    id: "6",
    profileImageUrl: "/images/slime.png",
    tag: "kokiri",
    nickname: "코기리",
  },
  {
    id: "7",
    profileImageUrl: "/images/slime.png",
    tag: "kokiri",
    nickname: "코기리",
  },
  {
    id: "8",
    profileImageUrl: "/images/slime.png",
    tag: "kokiri",
    nickname: "코기리",
  },
  {
    id: "9",
    profileImageUrl: "/images/slime.png",
    tag: "kokiri",
    nickname: "코기리",
  },
  {
    id: "10",
    profileImageUrl: "/images/slime.png",
    tag: "kokiri",
    nickname: "코기리",
  },
];
