// providers/ReloadModalProvider.tsx
"use client";

import { useEffect, useState } from "react";
import ForceReloadModal from "@/components/common/ForceReloadModal";
import Reload from "@/utils/reload";

export const ReloadModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    Reload.setCallback((msg: string) => {
      setMessage(msg);
      setIsOpen(true);
    });
  }, []);

  return (
    <>
      {children}
      <ForceReloadModal isOpen={isOpen} message={message} />
    </>
  );
};
