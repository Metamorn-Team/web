import { PawnColor } from "@/constants/game/entities";

export const mapPawnColor = (currentColor: PawnColor) => {
  switch (currentColor) {
    case "blue":
      return "파랑";
    case "red":
      return "빨강";
    case "yellow":
      return "노랑";
    case "purple":
      return "보라";
    case "forest_green":
      return "숲초록";
    case "pure_shadow":
      return "그림자";
    case "orange":
      return "오렌지";
  }
};
