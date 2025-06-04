"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import RetroModal from "@/components/common/RetroModal";
import rehypeRaw from "rehype-raw";

interface UpdateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UpdateNoteModal({
  isOpen,
  onClose,
}: UpdateNoteModalProps) {
  const [markdown, setMarkdown] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      fetch("/update-note.md")
        .then((res) => res.text())
        .then(setMarkdown)
        .catch(() => setMarkdown("업데이트 노트를 불러오는 데 실패했어요."));
    }
  }, [isOpen]);
  console.log(markdown);

  return (
    <RetroModal
      isOpen={isOpen}
      onClose={onClose}
      className="max-h-[80dvh] scrollbar-hide"
    >
      <div className="prose prose-sm max-w-full text-[#3d2c1b] ">
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>{markdown}</ReactMarkdown>
      </div>
    </RetroModal>
  );
}
