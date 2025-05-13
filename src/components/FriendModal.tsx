"use client";

import React, { Suspense, useCallback, useEffect, useState } from "react";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Ribon from "@/components/common/Ribon";
import ReceivedFriendRequestItemList from "@/components/friend/ReceivedFriendRequestItemList";
import SearchFriendList from "@/components/friend/SearchFriendList";
import SentFriendRequestItemList from "@/components/friend/SentFriendRequestItemList";
import FriendItmeList from "@/components/FriendItemList";
import { useMarkAllFriendRequestAsRead } from "@/hook/queries/useMarkAllFriendRequestAsRead";
import { useGetUnreadFriendRequest } from "@/hook/queries/useGetUnreadFriendRequest";

interface FriendModalProps {
  onClose: () => void;
}

const menus = {
  "친구 목록": FriendItmeList,
  "회원 검색": SearchFriendList,
  "받은 요청": ReceivedFriendRequestItemList,
  "보낸 요청": SentFriendRequestItemList,
};

type Menu = keyof typeof menus;

const FriendModal = ({ onClose }: FriendModalProps) => {
  const [selected, setSelected] = useState<Menu>("친구 목록");
  const { mutate: markAllRequestAsRead } = useMarkAllFriendRequestAsRead();
  const { data: unreadRequestCount } = useGetUnreadFriendRequest();

  const renderContents = useCallback(() => {
    const Component = menus[selected];

    return (
      <div className="flex-1 min-h-0">
        <Component />
      </div>
    );
  }, [selected]);

  useEffect(() => {
    markAllRequestAsRead();
  }, []);

  useEffect(() => {
    if (unreadRequestCount) {
      if (unreadRequestCount.count > 0) {
        setSelected("받은 요청");
      }
    }
  }, [unreadRequestCount]);

  return (
    <Modal
      onClose={onClose}
      className="relative h-[80vh] max-h-[800px] w-[90vw] max-w-[500px]"
    >
      <div className="flex flex-col h-full">
        {/* 헤더 부분 */}
        <div className="relative w-full flex justify-center items-center mb-3">
          <Ribon title="친구" color="yellow" width={130} fontSize={20} />
        </div>

        {/* 컨텐츠 영역 */}
        <div className="flex-1 min-h-0 flex flex-col px-4 pb-4">
          <Suspense
            fallback={
              <div className="flex-1 flex items-center justify-center">
                로딩 중...
              </div>
            }
          >
            {renderContents()}
          </Suspense>
        </div>

        {/* 하단 메뉴 버튼 */}
        <div className="flex gap-2 w-full justify-between px-4 pb-4">
          {Object.keys(menus).map((menu) => (
            <Button
              key={menu}
              title={menu}
              color="yellow"
              width={"30%"}
              fontSize="text-sm"
              isActive={menu === selected}
              onClick={() => setSelected(menu as Menu)}
            />
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default FriendModal;
