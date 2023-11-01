import { Component, OnInit } from '@angular/core';
import { FirestoreDataService } from '../../services/firestore-data.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Place } from '../../models/place';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateEditPlaceComponent } from './create-edit-place/create-edit-place.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-places-overview',
  templateUrl: './places-overview.component.html',
  styleUrls: ['./places-overview.component.scss']
})
export class PlacesOverviewComponent implements OnInit {

  places: Place[];

  constructor(
    private firestoreDataService: FirestoreDataService<Place>,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toastrService: ToastrService
  ) {
    this.firestoreDataService.collectionName = 'places';
  }

  ngOnInit(): void {
    this.firestoreDataService.getAll().subscribe(
      places => this.places = places
    );
  }

  createPlace(): void {
    this.modalService.open(CreateEditPlaceComponent, { centered: true }).result.catch(() => {});
  }

  updatePlace(id: string): void {
    const modalRef = this.modalService.open(CreateEditPlaceComponent, { centered: true });
    (modalRef.componentInstance as CreateEditPlaceComponent).placeId = id;
    modalRef.result.catch(() => {});
  }

  deletePlace(id: string): void {
    this.firestoreDataService.delete(id).subscribe(
      () => {
        console.log("Deleted");
      }
    );
  }
}
