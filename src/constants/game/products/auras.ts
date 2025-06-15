interface NormalAura {
  color: number;
  outerStrength?: number;
  innerStrength?: number;
}

export const NORMAL_AURAS: { [key: string]: NormalAura } = {
  // NOTE 무료제공
  "ice-blue-aura": { color: 0x5fe7f2, outerStrength: 3 },
  "rose-pink-aura": { color: 0xff87b3, outerStrength: 3 },

  "gold-yellow-aura": {
    color: 0xfabb43,
  },
  "magic-purple-aura": { color: 0xb46dff },
  "toxic-green-aura": { color: 0x96f55a },
  "shadow-black-aura": { color: 0x2d2d2d },
  "lavender-aura": { color: 0xe6e6fa },
  "tomato-aura": { color: 0xff6f61 },

  // NOTE new 6/9
  "slim-green": { color: 0xbaff29 },
  "glitch-pink": { color: 0xff1aff },
  "midnight-teal": { color: 0x005f6a },
  "electric-indigo": { color: 0x6f00ff },
  necro: { color: 0x4a0033, outerStrength: 3 },
  "cotton-candy": { color: 0xffb7ee },

  "arcane-blue": { color: 0x66ccff }, // 시원하고 신비로운 파란빛
  "eldritch-green": { color: 0x00ff9f }, // 어두운 초록과 푸른빛 사이
  "stellar-purple": { color: 0xcc99ff }, // 부드러운 라벤더+보라빛
  "crystal-cyan": { color: 0x00ffff }, // 수정 느낌의 푸른 빛

  "neon-orange": { color: 0xffa500 }, // 밝고 생동감 있는 오렌지
  "laser-red": { color: 0xff0044 }, // 강렬한 붉은 레이저 색
  "techno-lime": { color: 0x99ff33 }, // 네온 라임
  "byte-blue": { color: 0x00ccff }, // 해커 느낌의 파란빛

  "abyss-purple": { color: 0x4b0082, outerStrength: 4 }, // 인디고 느낌의 깊은 보라
  "blood-red": { color: 0x990000 }, // 어두운 핏빛
  "void-gray": { color: 0x444444 }, // 공허한 느낌의 회색
  "phantom-white": { color: 0xfafaff }, // 희미한 고스트 화이트
} as const;
