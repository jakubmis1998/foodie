import { Component } from '@angular/core';
import { FirestoreDataService } from '../../services/firestore-data.service';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateEditPlaceComponent } from './create-edit-place/create-edit-place.component';
import { Emoji } from '../../models/emoji';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-places-overview',
  templateUrl: './places-overview.component.html',
  styleUrls: ['./places-overview.component.scss']
})
export class PlacesOverviewComponent {

  Emoji = Emoji;

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

  goToDetails(id: string): void {
    this.router.navigate([id], { relativeTo: this.activatedRoute }).then(() => {});
  }
}
