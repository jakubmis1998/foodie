import { Component, OnInit } from '@angular/core';
import { FirestoreDataService } from '../../services/firestore-data.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Place } from '../../models/place';

@Component({
  selector: 'app-places-overview',
  templateUrl: './places-overview.component.html',
  styleUrls: ['./places-overview.component.scss']
})
export class PlacesOverviewComponent implements OnInit {

  places: Place[];
  form: FormGroup;

  constructor(
    private firestoreDataService: FirestoreDataService<Place>,
    private fb: FormBuilder
  ) {
    this.firestoreDataService.collectionName = 'places';
  }

  ngOnInit(): void {
    this.firestoreDataService.getAll().subscribe(
      places => this.places = places
    );

    this.form = this.fb.group({
      name: new FormControl<string>(''),
      rate: new FormControl<string>(''),
      location: new FormControl<number | null>(null)
    });
  }

  createPlace(): void {
    this.firestoreDataService.create(this.form.value).subscribe(
      () => {
        console.log("Added");
      }
    );
  }

  updatePlace(id: string): void {
    this.firestoreDataService.update(id, this.form.value).subscribe(
      () => {
        console.log("Updated");
      }
    );
  }

  deletePlace(id: string): void {
    this.firestoreDataService.delete(id).subscribe(
      () => {
        console.log("Deleted");
      }
    );
  }
}
