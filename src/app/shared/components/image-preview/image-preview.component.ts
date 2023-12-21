import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Emoji } from '../../../models/emoji';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.scss']
})
export class ImagePreviewComponent implements OnInit {

  Emoji = Emoji;
  photoUrl: string;

  @Input() getPhotoUrl: () => Observable<string>;

  constructor(
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.getPhotoUrl().subscribe(photoUrl => this.photoUrl = photoUrl);
  }
}
