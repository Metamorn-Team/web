import React, { useState } from "react";
import SearchFriendList from "./SearchFriendList"; // 경로 조정 필요
import Modal from "@/components/common/Modal";
import Ribon from "@/components/common/Ribon";

type SearchType = "NICKNAME" | "TAG";

interface SearchFriendModalProps {
  onClose: () => void;
}

const SearchFriendModal: React.FC<SearchFriendModalProps> = ({ onClose }) => {
  const [searchType, setSearchType] = useState<SearchType>("NICKNAME");

  return (
    <Modal
      onClose={onClose}
      className="h-3/4 bg-[#f9f5ec] border border-[#d6c6aa] shadow-lg rounded-xl"
    >
      <div className="flex flex-col items-center gap-4 px-4 pt-4 h-full ">
        <div>
          <Ribon title="회원 검색" color="yellow" width={150} fontSize={20} />
        </div>

        {/* 검색 타입 선택 UI */}
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => setSearchType("NICKNAME")}
            className={`px-4 py-1 rounded-full border text-sm transition ${
              searchType === "NICKNAME"
                ? "bg-[#d6c6aa] text-white border-[#b5a183]"
                : "bg-[#f3ece1] text-[#5c4b32] border-[#d6c6aa] hover:bg-[#e8e0d0]"
            }`}
          >
            닉네임
          </button>
          <button
            onClick={() => setSearchType("TAG")}
            className={`px-4 py-1 rounded-full border text-sm transition ${
              searchType === "TAG"
                ? "bg-[#d6c6aa] text-white border-[#b5a183]"
                : "bg-[#f3ece1] text-[#5c4b32] border-[#d6c6aa] hover:bg-[#e8e0d0]"
            }`}
          >
            태그
          </button>
        </div>

        {/* 검색 결과 리스트 */}
        <div className="flex-1 w-full">
          <SearchFriendList />
        </div>
      </div>
    </Modal>
  );
};

export default SearchFriendModal;
