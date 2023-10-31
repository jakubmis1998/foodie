import { NgModule } from '@angular/core';
import { EmojiPipe } from './emoji.pipe';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    EmojiPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    EmojiPipe
  ]
})
export class PipesModule { }
