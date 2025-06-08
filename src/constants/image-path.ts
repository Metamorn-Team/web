export const CDN_URL = "https://cdn.metamorn.com";
export const PAWN_AVATAR_URL = (key: string) =>
  `${CDN_URL}/image/avatar/${key}_avatar.png`;
export const PAWN_ANIMATION_URL = (color: string, anim: string) =>
  `${CDN_URL}/anim/${color}_pawn_${anim}.png`;

export const BUCKET_PATH = {
  ISLAND: "island",
};
