// https://prod.emojipedia.org/emoji/
export enum Emoji {
  hamburger = 0x1F354,
  wave = 0x1F44B
}

export function getEmoji(code: Emoji): string {
  return String.fromCodePoint(Number(code));
}
