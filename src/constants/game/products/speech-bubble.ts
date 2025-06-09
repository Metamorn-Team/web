interface SpeechBubble {
  bubble: string;
  tail: string;
}

export const speechBubble: { [key: string]: SpeechBubble } = {
  default: {
    bubble: "default-bubble",
    tail: "default-tail",
  },
  white: {
    bubble: "white-bubble",
    tail: "white-tail",
  },
  brown: {
    bubble: "brown-bubble",
    tail: "brown-tail",
  },
};
