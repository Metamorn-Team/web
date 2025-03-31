import { useState } from "react";

export const useModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onOpen = () => setIsModalOpen(true);
  const onClose = () => setIsModalOpen(false);
  const changeModalOpen = (state: boolean) => setIsModalOpen(state);

  return { isModalOpen, setIsModalOpen, onOpen, onClose, changeModalOpen };
};
