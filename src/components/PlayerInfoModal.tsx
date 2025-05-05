import React, { useState } from "react";
import Image from "next/image";
import Button from "@/components/common/Button";
import SquareModal from "@/components/common/SquareModal";
import { UserInfo } from "@/types/socket-io/response";
import { useSendFriendRequest } from "@/hook/queries/useSendFriendRequest";
import { getItem } from "@/utils/persistence";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY as USER_QUERY_KEY } from "@/hook/queries/useGetUserProfile";
import { useChangeBio } from "@/hook/queries/useChangeBio";
import { useGetUserProfile } from "@/hook/queries/useGetUserProfile";

interface PlayerInfoModalProps {
  playerInfo: UserInfo;
  onClose: () => void;
  className?: string;
}

const PlayerInfoModal = ({
  onClose,
  playerInfo,
  className,
}: PlayerInfoModalProps) => {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useGetUserProfile(playerInfo.id);

  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState<string>("");

  const myProfile = getItem("profile");
  const isMe = (myProfile?.id || " ") === playerInfo.id;

  const onSuccess = () =>
    queryClient.invalidateQueries({
      queryKey: [USER_QUERY_KEY, playerInfo.id],
    });
  const { mutate: sendRequest } = useSendFriendRequest(onSuccess);
  const { mutate: changeBio } = useChangeBio(() => {
    onSuccess();
    setIsEditing(false);
  });

  const onSendRequest = () => {
    sendRequest({ targetUserId: playerInfo.id });
  };

  if (isLoading || !user) return <p>불러오는 중..</p>;

  const renderFriendButton = () => {
    if (isMe) return null;

    switch (user.friendStatus) {
      case "NONE":
        return (
          <Button
            color="yellow"
            onClick={onSendRequest}
            title="친구 요청"
            width={"40%"}
            fontSize={"text-sm"}
          />
        );
      case "SENT":
        return <p>수락 대기중</p>;
      case "RECEIVED":
        return <p>친구 요청 받음</p>;
      case "ACCEPTED":
        return (
          <div className="relative w-24 h-12">
            <Image
              src={"/images/pawn_friend.png"}
              fill
              objectFit="cover"
              alt="친구"
            />
            <p className="absolute -bottom-5 right-1/2 translate-x-1/2 text-lg">
              친구
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <SquareModal
      onClose={onClose}
      width={"30%"}
      className={`${className} min-w-[500px]`}
    >
      <div className="w-full h-full flex flex-col items-center justify-between py-6 px-2">
        <div className="flex flex-col items-center gap-4">
          <div>
            <Image
              src={`/images/avatar/${user.avatarKey || "purple_pawn"}.png`}
              width={64}
              height={64}
              alt="avatar"
            />
          </div>
          <div className="flex flex-col items-center">
            <div className="text-xl font-bold">{user.nickname}</div>

            <div className="text-sm text-[#5c4b32] bg-[#f9f5ec] border border-[#d6c6aa] rounded-full px-3 py-1">
              @{user.tag}
            </div>
          </div>

          {/* 자기소개 영역 */}
          <div className="relative w-full bg-[#f9f5ec] border border-[#d6c6aa] rounded-md px-5 py-5 text-sm text-[#5c4b32] text-center shadow-inner max-w-[340px]">
            {!isEditing && (
              <>
                {isMe && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="absolute top-1 right-2 text-xs text-[#5c4b32] hover:underline"
                  >
                    ✏️ 수정
                  </button>
                )}
                {user.bio ? `💬 ${user.bio}` : "💬 자기소개가 아직 없어요!"}
              </>
            )}

            {isEditing && (
              <div className="flex flex-col gap-2">
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={300}
                  className="w-full p-2 border border-[#d6c6aa] rounded text-sm resize-none"
                  rows={4}
                />
                <div className="flex justify-end gap-2 text-sm">
                  <button
                    onClick={() => {
                      setBio("");
                      setIsEditing(false);
                    }}
                    className="px-2 py-1 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
                  >
                    취소
                  </button>
                  <button
                    onClick={() =>
                      changeBio({ bio: bio.trim().length === 0 ? null : bio })
                    }
                    className="px-2 py-1 rounded bg-[#bfae96] text-white hover:bg-[#a39179]"
                  >
                    저장
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {renderFriendButton()}
      </div>
    </SquareModal>
  );
};

export default PlayerInfoModal;
