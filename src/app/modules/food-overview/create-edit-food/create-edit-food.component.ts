import { Component, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutocompleteResult } from 'autocompleter';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { map, Observable, of, switchMap, zip } from 'rxjs';
import { ObjectType } from '../../../models/utils';
import autocomplete from 'autocompleter';
import { getAverageRating } from '../../../shared/utils/rating';
import { Emoji } from '../../../models/emoji';
import { Food } from '../../../models/food';
import { FirestoreFoodDataService } from '../../../services/firestore-data/firestore-food-data.service';
import { FirestorePlaceDataService } from '../../../services/firestore-data/firestore-place-data.service';
import { Place } from '../../../models/place';
import { FilterParams, ListParams, PaginationParams, SortingParams } from '../../../models/list-params';

@Component({
  selector: 'app-create-edit-food',
  templateUrl: './create-edit-food.component.html',
  styleUrls: ['./create-edit-food.component.scss']
})
export class CreateEditFoodComponent {

  Emoji = Emoji;
  form: FormGroup;
  loading = false;
  autocomplete: AutocompleteResult;
  food: Food;
  place: Place;

  @Input() foodId: string;

  constructor(
    private fb: FormBuilder,
    private firestoreFoodDataService: FirestoreFoodDataService,
    private firestorePlaceDataService: FirestorePlaceDataService,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    (this.foodId ? this.firestoreFoodDataService.get(this.foodId) : of({})).pipe(
      map((food: Food | {}) => food as Food),
      switchMap((food: Food) => {
        return zip(of(food), food.placeId ? this.firestorePlaceDataService.get(food.placeId) : of({}))
      })
    ).subscribe(result => {
      this.food = result[0] as Food;
      this.place = result[1] as Place;
      this.initForm();
      setTimeout(() => {
        this.initAutocomplete();
      });
    });
  }

  initForm(): void {
    const defaultRateValue = 2.5;
    this.form = this.fb.group({
      name: this.fb.control<string | undefined>(this.food?.name, [Validators.required]),
      price: this.fb.control<number | undefined>(this.food?.price, [Validators.required, Validators.min(0)]),
      rating: this.fb.group({
        taste: this.fb.control<number>(this.food?.rating?.taste || defaultRateValue),
        look: this.fb.control<number>(this.food?.rating?.look || defaultRateValue),
        price: this.fb.control<number>(this.food?.rating?.price || defaultRateValue),
        portionSize: this.fb.control<number>(this.food?.rating?.portionSize || defaultRateValue)
      }),
      placeId: this.fb.control<string | undefined>(this.food?.placeId, [Validators.required]),
      tags: this.fb.control<string[]>(this.food?.tags || [])
    });
  }

  save(): void {
    this.loading = true;
    let saveCall: Observable<void>;
    if (this.form.valid) {

      const formData = this.getFormData();

      if (!this.foodId) {
        saveCall = this.firestoreFoodDataService.create(formData);
      } else {
        saveCall = this.firestoreFoodDataService.update(this.foodId, formData);
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
    const nameTags = data.name.toLowerCase().split(' ');
    this.form.get('tags')?.setValue([...new Set([...this.form.value.tags, ...nameTags])]);

    const now = Date.now();
    data.createdAt = this.food?.createdAt || now;
    data.changedAt = now;
    data.averageRating = getAverageRating(this.form.value.rating);
    data.tags = this.form.value.tags;
    data.thumbnailUrl = 'https://www.adorama.com/alc/wp-content/uploads/2018/11/landscape-photography-tips-yosemite-valley-feature.jpg';

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
    const input = document.getElementById('placeId')! as HTMLInputElement;
    const displayLabel = (place: Place) => {
      const displayItems = place.address.display_name.split(', ') as string[];
      return displayItems.slice(0, displayItems.length - 3).join(', ') || place.address.display_name || place.name;
    };
    input.value = this.place.address ? displayLabel(this.place) : '';
    this.autocomplete = autocomplete({
      input,
      minLength: 3,
      emptyMsg: 'No places found',
      debounceWaitMs: 1000,
      fetch: (text: string, update: (items: Place[]) => void) => {
        this.firestorePlaceDataService.getAll(
          undefined, false,
          new ListParams(
            new SortingParams(),
            new FilterParams('tags', text),
            new PaginationParams(10)
          )
        ).subscribe(results => update(results.items as Place[]));
      },
      render: (item: Place, currentValue: any) => {
        // Render option label
        const div = document.createElement('div');
        div.textContent = displayLabel(item);
        return div;
      },
      onSelect: (item: Place) => {
        this.form.get('placeId')?.setValue(item.id); // Set place ID
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
