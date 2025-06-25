export const TREE = "tree";
export const MUSHROOM_L = "mushroom-l";
export const SKULL_SIGN = "skull-sign";

export const NATURE_SPRITE = {
  TREE: "TREE",
  ROCK_XS: "ROCK_XS",
  ROCK_S: "ROCK_S",
  ROCK_M: "ROCK_M",
  ROCK_L: "ROCK_L",
} as const;
export type NATURE_SPRITE_KEY = keyof typeof NATURE_SPRITE;
