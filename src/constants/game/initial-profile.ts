import { PAWN } from "@/constants/game/entities";

export const INITIAL_PROFILE = {
  id: "initial",
  avatarKey: PAWN("purple"),
  nickname: " ",
  tag: "hello_livisland",
  bio: "섬으로 떠나자!!",
  email: "",
  provider: "GOOGLE" as const,
  equipmentState: {
    AURA: null,
    SPEECH_BUBBLE: null,
  },
};
