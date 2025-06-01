interface NormalAura {
  color: number;
  outerStrength?: number;
  innerStrength?: number;
}

export const NORMAL_AURAS: { [key: string]: NormalAura } = {
  "gold-yellow-aura": {
    color: 0xfabb43,
  },
  "magic-purple-aura": { color: 0xb46dff },
  "ice-blue-aura": { color: 0x5fe7f2 },
  "toxic-green-aura": { color: 0x96f55a },
  "rose-pink-aura": { color: 0xff87b3 },
  "shadow-black-aura": { color: 0x2d2d2d },
  "lavender-aura": { color: 0xe6e6fa },
  "tomato-aura": { color: 0xff6f61 },
} as const;
