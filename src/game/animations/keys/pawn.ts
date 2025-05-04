import { PawnColor } from "@/constants/game/entities";

export const PAWN_IDLE = (color: PawnColor) => `${color}_pawn_idle`;
export const PAWN_WALK = (color: PawnColor) => `${color}_pawn_walk`;
export const PAWN_ATTACK = (color: PawnColor) => `${color}_pawn_attack`;
export const PAWN_JUMP = (color: PawnColor) => `${color}_pawn_jump`;
