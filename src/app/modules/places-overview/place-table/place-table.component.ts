import { Component } from '@angular/core';
import { FirestoreDataService } from '../../../services/firestore-data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateEditPlaceComponent } from '../create-edit-place/create-edit-place.component';
import { Emoji } from '../../../models/emoji';
import { Place } from '../../../models/place';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { faRemove } from '@fortawesome/free-solid-svg-icons';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-place-table',
  templateUrl: './place-table.component.html',
  styleUrls: ['./place-table.component.scss']
})
export class PlaceTableComponent {

  Emoji = Emoji;
  faEdit = faEdit;
  faRemove = faRemove;

  constructor(
    public firestoreDataService: FirestoreDataService,
    private modalService: NgbModal,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  createPlace(): void {
    this.modalService.open(CreateEditPlaceComponent, { centered: true }).result.catch(() => {});
  }

  updatePlace(id: string): void {
    const modalRef = this.modalService.open(CreateEditPlaceComponent, { centered: true });
    (modalRef.componentInstance as CreateEditPlaceComponent).placeId = id;
    modalRef.result.catch(() => {});
  }

  deletePlace(id: string): void {
    const modalRef = this.modalService.open(ConfirmModalComponent, { centered: true });
    (modalRef.componentInstance as ConfirmModalComponent).itemName = 'place';
    modalRef.result.then(result => {
      if (result) {
        this.firestoreDataService.delete(id).subscribe();
      }
    });
  }

  goToDetails(item: Place): void {
    this.router.navigate([item.id], { relativeTo: this.activatedRoute, state: { item } }).then(() => {});
  }
}
