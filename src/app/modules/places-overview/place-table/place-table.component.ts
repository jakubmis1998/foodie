import { Component } from '@angular/core';
import { FirestoreDataService } from '../../../services/firestore-data.service';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateEditPlaceComponent } from '../create-edit-place/create-edit-place.component';
import { Emoji } from '../../../models/emoji';
import { Place } from '../../../models/place';
import { faEdit, faTrashAlt } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-place-table',
  templateUrl: './place-table.component.html',
  styleUrls: ['./place-table.component.scss']
})
export class PlaceTableComponent {

  Emoji = Emoji;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;

  constructor(
    public firestoreDataService: FirestoreDataService,
    private fb: FormBuilder,
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
    this.firestoreDataService.delete(id).subscribe();
  }

  goToDetails(item: Place): void {
    this.router.navigate([item.id], { relativeTo: this.activatedRoute, state: { item } }).then(() => {});
  }
}
