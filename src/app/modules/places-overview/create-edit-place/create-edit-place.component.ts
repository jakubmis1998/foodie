import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Emoji } from '../../../models/emoji';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Place } from '../../../models/place';
import { FirestoreDataService } from '../../../services/firestore-data.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { getAverageRating } from '../../../shared/utils/rating';
import { LocationService } from '../../../services/location.service';
import autocomplete from 'autocompleter';
import { AutocompleteResult } from 'autocompleter/autocomplete';
import { OpenStreetService } from '../../../services/openstreet.service';

@Component({
  selector: 'app-create-edit-place',
  templateUrl: './create-edit-place.component.html',
  styleUrls: ['./create-edit-place.component.scss']
})
export class CreateEditPlaceComponent implements OnInit, AfterViewInit, OnDestroy {

  Emoji = Emoji;
  form: FormGroup;
  loading = false;
  selectedPlace: any;
  autocomplete: AutocompleteResult;

  @Input() placeId: string;

  constructor(
    private fb: FormBuilder,
    private firestoreDataService: FirestoreDataService,
    public activeModal: NgbActiveModal,
    private locationService: LocationService,
    private osmService: OpenStreetService
  ) {}

  ngOnInit(): void {
    (this.placeId ? this.firestoreDataService.get(this.placeId) : of({} as Place)).subscribe(place => {
      this.initForm(place as Place);
    });
  }

  ngAfterViewInit(): void {
    if (!this.placeId) {
      this.initAutocomplete();
    }
  }

  initAutocomplete(): void {
    const input = document.getElementById('address')! as HTMLInputElement;
    this.autocomplete = autocomplete({
      minLength: 3,
      input,
      emptyMsg: 'No places found',
      debounceWaitMs: 1000,
      fetch: (text: string, update: (items: any[]) => void) => {
        this.osmService.search(text).subscribe(results => {
          update(results);
        });
      },
      render: (item: any, currentValue: any) => {
        console.log(12341, item);
        const div = document.createElement('div');
        const displayItems = item.display_name.split(', ') as string[];
        div.textContent = displayItems.slice(0, displayItems.length - 3).join(', ');
        return div;
      },
      onSelect: (item: any) => {
        this.selectedPlace = item;
        const displayItems = item.display_name.split(', ') as string[];
        input.value = displayItems.slice(0, displayItems.length - 3).join(', ');
      },
      keyup: e => e.fetch(),
      click: e => e.fetch()
    } as any);
  }

  initForm(place?: Place): void {
    const defaultRateValue = 2.5;
    this.form = this.fb.group({
      name: this.fb.control<string | undefined>(place?.name, [Validators.required]),
      address: this.fb.control(place?.address, this.placeId ? [] : [Validators.required]),
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
    if (!this.placeId) {
      this.form.get('address')?.setValue(this.selectedPlace);
    }
    if (this.form.valid) {
      const now = new Date();
      this.form.get('changedAt')?.setValue(now);
      this.form.get('averageRating')?.setValue(getAverageRating(this.form.value.rating));

      // Naprawić distance - powinno sie aktualizowac zawsze, gdy wchodzę na overview / naciskam refresh
      // this.form.get('address.distance')?.setValue(this.locationService.getDistance(this.form.get('address.coords')?.value));

      console.log(this.form.value);
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
    } else {
      this.loading = false;
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

  ngOnDestroy(): void {
    this.autocomplete?.destroy();
  }
}
