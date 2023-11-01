import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Emoji } from '../../../models/emoji';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Place, PlaceAddress, PlaceRating } from '../../../models/place';
import { FirestoreDataService } from '../../../services/firestore-data.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize, Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

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
    private firestoreDataService: FirestoreDataService<Place>,
    public activeModal: NgbActiveModal,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    (this.placeId ? this.firestoreDataService.get(this.placeId) : of({} as Place)).subscribe(place => {
      this.initForm(place);
    });
  }

  initForm(place?: Place): void {
    const defaultRateValue = 5;
    this.form = this.fb.group({
      name: this.fb.control<string | undefined>(place?.name, [Validators.required]),
      address: this.fb.group({
        city: this.fb.control<string | undefined>(place?.address?.city),
        street: this.fb.control<string | undefined>(place?.address?.street),
        streetNumber: this.fb.control<number | undefined>(place?.address?.streetNumber)
      }),
      rating: this.fb.group({
        localization: this.fb.control<number>(place?.rating?.localization || defaultRateValue),
        staff: this.fb.control<number>(place?.rating?.staff || defaultRateValue),
        comfort: this.fb.control<number>(place?.rating?.comfort || defaultRateValue),
        prices: this.fb.control<number>(place?.rating?.prices || defaultRateValue),
        cleanliness: this.fb.control<number>(place?.rating?.cleanliness || defaultRateValue)
      }),
      tags: this.fb.control<string[] | undefined>(place?.tags)
    });
  }

  save(): void {
    this.loading = true;
    let saveCall: Observable<void>;
    if (this.form.valid) {
      if (!this.placeId) {
        saveCall = this.firestoreDataService.create(this.form.value);
      } else {
        saveCall = this.firestoreDataService.update(this.placeId, this.form.value);
      }

      saveCall.subscribe(() => {
        this.loading = false;
        this.activeModal.close();
        this.toastrService.success(this.placeId ? 'Place updated!' : 'New place added!', 'Success');
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
