import { Component, Input, OnInit } from '@angular/core';
import { Emoji } from '../../../models/emoji';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Place } from '../../../models/place';
import { FirestoreDataService } from '../../../services/firestore-data.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { getAverageRating } from '../../../shared/utils/rating';
import { LocationService } from '../../../services/location.service';

@Component({
  selector: 'app-create-edit-place',
  templateUrl: './create-edit-place.component.html',
  styleUrls: ['./create-edit-place.component.scss']
})
export class CreateEditPlaceComponent implements OnInit {

  Emoji = Emoji;
  form: FormGroup;
  loading = false;

  @Input() placeId: string;

  constructor(
    private fb: FormBuilder,
    private firestoreDataService: FirestoreDataService,
    public activeModal: NgbActiveModal,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    (this.placeId ? this.firestoreDataService.get(this.placeId) : of({} as Place)).subscribe(place => {
      this.initForm(place as Place);
    });
  }

  initForm(place?: Place): void {
    const defaultRateValue = 2.5;
    this.form = this.fb.group({
      name: this.fb.control<string | undefined>(place?.name, [Validators.required]),
      address: this.fb.group({
        city: this.fb.control<string | undefined>(place?.address?.city, [Validators.required]),
        street: this.fb.control<string | undefined>(place?.address?.street, [Validators.required]),
        streetNumber: this.fb.control<number | undefined>(place?.address?.streetNumber),
        distance: this.fb.control<number | undefined>(place?.address?.distance),
        coords: this.fb.group({
          latitude: this.fb.control<number | undefined>(place?.address?.coords?.latitude),
          longitude: this.fb.control<number | undefined>(place?.address?.coords?.longitude)
        }),
      }),
      averageRating: this.fb.control<number | undefined>(undefined),
      rating: this.fb.group({
        localization: this.fb.control<number>(place?.rating?.localization || defaultRateValue),
        staff: this.fb.control<number>(place?.rating?.staff || defaultRateValue),
        comfort: this.fb.control<number>(place?.rating?.comfort || defaultRateValue),
        prices: this.fb.control<number>(place?.rating?.prices || defaultRateValue),
        cleanliness: this.fb.control<number>(place?.rating?.cleanliness || defaultRateValue)
      }),
      tags: this.fb.control<string[] | undefined>(place?.tags),
      createdAt: this.fb.control<Date | undefined>(place?.createdAt),
      changedAt: this.fb.control<Date | undefined>(place?.changedAt)
    });
  }

  save(): void {
    this.loading = true;
    let saveCall: Observable<void>;
    if (this.form.valid) {
      const now = new Date();
      this.form.get('changedAt')?.setValue(now);
      this.form.get('averageRating')?.setValue(getAverageRating(this.form.value.rating));

      // Temporary mocking coordinates
      const randomLat = Math.floor(Math.random() * (55 - 51 + 1) + 51);
      const randomLon = Math.floor(Math.random() * (20 - 16 + 1) + 16);
      this.form.get('address.coords')?.setValue({
        latitude: randomLat,
        longitude: randomLon
      });
      this.form.get('address.distance')?.setValue(this.locationService.getDistance(this.form.get('address.coords')?.value));

      if (!this.placeId) {
        this.form.get('createdAt')?.setValue(now);
        saveCall = this.firestoreDataService.create(this.form.value);
      } else {
        saveCall = this.firestoreDataService.update(this.placeId, this.form.value);
      }

      saveCall.subscribe(() => {
        this.loading = false;
        this.activeModal.close();
      }, () => this.loading = false);
    }
  }

  getFieldValue(fieldName: string): any {
    return this.form.get(fieldName)?.value;
  }

  setStarValue(fieldName: string, value: number): void {
    this.form.get(fieldName)?.setValue(value);
  }

  isValidField(fieldName: string, validationType = 'required'): boolean {
    return (this.form.get(fieldName)?.touched) && this.form.get(fieldName)?.errors?.[validationType];
  }
}
