import { Pipe, PipeTransform } from '@angular/core';
import { Emoji } from '../models/emoji';

@Pipe({name: 'emoji'})
export class EmojiPipe implements PipeTransform {
  transform(emojiCode: Emoji): string {
    return String.fromCodePoint(Number(emojiCode));
  }
}
