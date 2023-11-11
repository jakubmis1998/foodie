// https://prod.emojipedia.org/emoji/
export enum Emoji {
  hamburger = 0x1F354,
  wave = 0x1F44B,
  run = 0x1F3C3,
  star = 0x2B50,
  eyes = 0x1F440,
  red = 0x1F534
}

export function getEmoji(code: Emoji): string {
  return String.fromCodePoint(Number(code));
}
