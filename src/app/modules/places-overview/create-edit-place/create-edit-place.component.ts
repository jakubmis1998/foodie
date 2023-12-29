import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Emoji } from '../../../models/emoji';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Place } from '../../../models/place';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { map, Observable, of, switchMap, tap } from 'rxjs';
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
import { GooglePhotosService } from '../../../services/google-photos.service';
import { GooglePhoto } from '../../../models/googlePhoto';
import { faRemove } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-create-edit-place',
  templateUrl: './create-edit-place.component.html',
  styleUrls: ['./create-edit-place.component.scss']
})
export class CreateEditPlaceComponent implements OnInit, OnDestroy {

  faRemove = faRemove;
  Emoji = Emoji;
  form: FormGroup;
  loading = false;
  autocomplete: AutocompleteResult;
  place: Place;
  placeTypes: Observable<Constant[]>;
  selectedImage: { filename?: string; result?: ArrayBuffer; photoURL?: string } | undefined = undefined;

  @Input() placeId: string;

  constructor(
    private fb: FormBuilder,
    private firestorePlaceDataService: FirestorePlaceDataService,
    private firestoreConstantsDataService: FirestoreConstantsDataService,
    public activeModal: NgbActiveModal,
    private locationService: LocationService,
    private osmService: OpenStreetService,
    private googlePhotosService: GooglePhotosService
  ) {}

  ngOnInit(): void {
    this.placeTypes = this.firestoreConstantsDataService.getAll(
      undefined, false, new ListParams(
        new SortingParams('name'), new FilterParams('type', ConstantType.PLACE_TYPE), new PaginationParams(0)
      )
    ).pipe(
      map(result => result.items as Constant[])
    );

    (this.placeId ? this.firestorePlaceDataService.get(this.placeId) : of({})).pipe(
      tap(result => this.place = result as Place),
      switchMap(() => this.place.photoId ? this.googlePhotosService.get(this.place.photoId) : of(undefined))
    ).subscribe(photo => {
      this.selectedImage = {
        photoURL: photo?.baseUrl
      };
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
      types: this.fb.control<string[] | undefined>(this.place?.types, [Validators.required]),
      address: this.fb.control<ObjectType | undefined>(this.place?.address, this.placeId ? [] : [Validators.required]),
      rating: this.fb.group({
        localization: this.fb.control<number>(this.place?.rating?.localization || defaultRateValue),
        staff: this.fb.control<number>(this.place?.rating?.staff || defaultRateValue),
        comfort: this.fb.control<number>(this.place?.rating?.comfort || defaultRateValue),
        prices: this.fb.control<number>(this.place?.rating?.prices || defaultRateValue),
        design: this.fb.control<number>(this.place?.rating?.design || defaultRateValue)
      }),
      tags: this.fb.control<string[]>(this.place?.tags || [])
    });
  }

  save(): void {
    this.loading = true;
    if (this.form.valid) {
      this.getFormData().pipe(
        switchMap(formData => this.placeId ?
          this.firestorePlaceDataService.update(this.placeId, formData) :
          this.firestorePlaceDataService.create(formData)
        )
      ).subscribe(() => {
        this.loading = false;
        this.activeModal.close();
      }, () => this.loading = false);
    } else {
      this.loading = false;
    }
  }

  getFormData(): Observable<ObjectType> {
    const formData = this.form.value;

    const now = Date.now();
    formData.createdAt = this.place?.createdAt || now;
    formData.changedAt = now;
    formData.averageRating = getAverageRating(this.form.value.rating);
    formData.tags = getDefaultTags(formData, true);

    // Photo
    let call: Observable<GooglePhoto>;
    if (this.selectedImage?.result && this.selectedImage?.filename) {
      call = this.googlePhotosService.create(this.selectedImage.result, this.selectedImage.filename);
    } else {
      call = of({ id: this.place?.photoId } as GooglePhoto);
    }

    return call.pipe(
      map((photo: GooglePhoto) => {
        formData.photoId = photo.id || null;
        return formData;
      })
    );
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

  addPhoto(event: any): void {
    const file = event.target.files[0];
    const myReader = new FileReader();
    myReader.onloadend = () => {
      this.selectedImage = {
        filename: file.name,
        result: myReader.result as ArrayBuffer,
        photoURL: URL.createObjectURL(file)
      };
    };
    myReader.readAsArrayBuffer(file);
  }

  deletePhoto(): void {
    this.selectedImage = { photoURL: undefined };
    if (this.place) {
      this.place.photoId = undefined;
    }
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
