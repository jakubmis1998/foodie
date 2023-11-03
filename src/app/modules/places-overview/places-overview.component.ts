import { Component } from '@angular/core';
import { FirestoreDataService } from '../../services/firestore-data.service';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateEditPlaceComponent } from './create-edit-place/create-edit-place.component';

@Component({
  selector: 'app-places-overview',
  templateUrl: './places-overview.component.html',
  styleUrls: ['./places-overview.component.scss']
})
export class PlacesOverviewComponent {

  constructor(
    public firestoreDataService: FirestoreDataService,
    private fb: FormBuilder,
    private modalService: NgbModal
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
}
