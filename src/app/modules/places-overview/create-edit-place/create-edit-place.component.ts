import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Emoji } from '../../../models/emoji';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Place } from '../../../models/place';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, map, Observable, of } from 'rxjs';
import { getAverageRating } from '../../../shared/utils/rating';
import { LocationService } from '../../../services/location.service';
import autocomplete from 'autocompleter';
import { AutocompleteResult } from 'autocompleter/autocomplete';
import { OpenStreetService } from '../../../services/openstreet.service';
import { ObjectType } from '../../../models/utils';
import { getDefaultTags } from '../../../models/base-model';
import { FirestorePlaceDataService } from '../../../services/firestore-data/firestore-place-data.service';
import { Constant, ConstantType } from '../../../models/constant';
import { FirestoreConstantsDataService } from '../../../services/firestore-data/firestore-constants-data.service';
import { FilterParams, ListParams, PaginationParams, SortingParams } from '../../../models/list-params';

@Component({
  selector: 'app-create-edit-place',
  templateUrl: './create-edit-place.component.html',
  styleUrls: ['./create-edit-place.component.scss']
})
export class CreateEditPlaceComponent implements OnInit, OnDestroy {

  Emoji = Emoji;
  form: FormGroup;
  loading = false;
  autocomplete: AutocompleteResult;
  place: Place;
  placeTypes: Constant[];

  @Input() placeId: string;

  constructor(
    private fb: FormBuilder,
    private firestorePlaceDataService: FirestorePlaceDataService,
    private firestoreConstantsDataService: FirestoreConstantsDataService,
    public activeModal: NgbActiveModal,
    private locationService: LocationService,
    private osmService: OpenStreetService
  ) {}

  ngOnInit(): void {
    forkJoin([
      this.placeId ? this.firestorePlaceDataService.get(this.placeId) : of({} as Place),
      this.firestoreConstantsDataService.getAll(
        undefined, false, new ListParams(
          new SortingParams(), new FilterParams('type', ConstantType.PLACE_TYPE), new PaginationParams(0)
        )
      ).pipe(
        map(result => result.items)
      )
    ]).subscribe(result => {
      this.place = result[0] as Place;
      this.placeTypes = result[1] as Constant[];
      this.initForm();

      if (!this.placeId) {
        setTimeout(() => {
          this.initAutocomplete();
        });
      }
    });
  }

  initForm(): void {
    const defaultRateValue = 2.5;
    this.form = this.fb.group({
      name: this.fb.control<string | undefined>(this.place?.name, [Validators.required]),
      type: this.fb.control<string | undefined>(this.place?.type?.id, [Validators.required]),
      address: this.fb.control<ObjectType | undefined>(this.place?.address, this.placeId ? [] : [Validators.required]),
      rating: this.fb.group({
        localization: this.fb.control<number>(this.place?.rating?.localization || defaultRateValue),
        staff: this.fb.control<number>(this.place?.rating?.staff || defaultRateValue),
        comfort: this.fb.control<number>(this.place?.rating?.comfort || defaultRateValue),
        prices: this.fb.control<number>(this.place?.rating?.prices || defaultRateValue),
        cleanliness: this.fb.control<number>(this.place?.rating?.cleanliness || defaultRateValue)
      }),
      tags: this.fb.control<string[]>(this.place?.tags || [])
    });
  }

  save(): void {
    this.loading = true;
    let saveCall: Observable<void>;
    if (this.form.valid) {

      const formData = this.getFormData();

      if (!this.placeId) {
        saveCall = this.firestorePlaceDataService.create(formData);
      } else {
        saveCall = this.firestorePlaceDataService.update(this.placeId, formData);
      }

      saveCall.subscribe(() => {
        this.loading = false;
        this.activeModal.close();
      }, () => this.loading = false);
    } else {
      this.loading = false;
    }
  }

  getFormData(): ObjectType {
    const data = this.form.value;

    const now = Date.now();
    data.createdAt = this.place?.createdAt || now;
    data.changedAt = now;
    data.averageRating = getAverageRating(this.form.value.rating);
    data.tags = getDefaultTags(data, !!this.placeId);
    data.type = this.placeTypes.find(placeType => placeType.id === data.type);

    return data;
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

  initAutocomplete(): void {
    const input = document.getElementById('address')! as HTMLInputElement;
    const displayLabel = (item: ObjectType) => {
      const displayItems = item.display_name.split(', ') as string[];
      return displayItems.slice(0, displayItems.length - 3).join(', ') || item.display_name || item.name;
    };
    this.autocomplete = autocomplete({
      input,
      minLength: 3,
      emptyMsg: 'No places found',
      debounceWaitMs: 1000,
      fetch: (text: string, update: (items: ObjectType[]) => void) => {
        this.osmService.search(text).subscribe(results => update(results));
      },
      render: (item: ObjectType, currentValue: any) => {
        // Render option label
        const div = document.createElement('div');
        div.textContent = displayLabel(item);
        return div;
      },
      onSelect: (item: ObjectType) => {
        this.form.get('name')?.setValue(item.name); // Set form name
        this.form.get('address')?.setValue(item); // Set form address
        this.form.get('tags')?.setValue(getDefaultTags(this.form.value, false)); // Set form tags
        input.value = displayLabel(item); // Set input label
      },
      keyup: e => e.fetch(),
      click: e => e.fetch()
    } as any);
  }

  ngOnDestroy(): void {
    this.autocomplete?.destroy();
  }
}
