import { useState } from "react";

export const useModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const open = () => setIsModalOpen(true);
  const close = () => setIsModalOpen(false);
  const changeModalOpen = (state: boolean) => setIsModalOpen(state);

  return { isModalOpen, setIsModalOpen, open, close, changeModalOpen };
};
