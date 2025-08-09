import { pawnColors } from "@/constants/game/entities";

export const getRandomPawnColor = () =>
  pawnColors[Math.floor(Math.random() * pawnColors.length)];
