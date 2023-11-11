import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Emoji } from '../../../models/emoji';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent {

  Emoji = Emoji;

  @Input() itemName = 'item';

  constructor(public activeModal: NgbActiveModal) {}
}
