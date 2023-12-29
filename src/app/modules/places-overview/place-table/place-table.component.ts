import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateEditPlaceComponent } from '../create-edit-place/create-edit-place.component';
import { Emoji } from '../../../models/emoji';
import { Place } from '../../../models/place';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { faRemove, faMagnifyingGlass, faEye } from '@fortawesome/free-solid-svg-icons';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { LocationService } from '../../../services/location.service';
import { map, Observable } from 'rxjs';
import { FilterParams, ListParams, PaginationParams, SortingParams } from '../../../models/list-params';
import { FirestorePlaceDataService } from '../../../services/firestore-data/firestore-place-data.service';
import { OverviewType } from '../../../models/utils';
import { FirestoreFoodDataService } from '../../../services/firestore-data/firestore-food-data.service';
import { Food } from '../../../models/food';
import { ImagePreviewComponent } from '../../../shared/components/image-preview/image-preview.component';
import { GooglePhotosService } from '../../../services/google-photos.service';

@Component({
  selector: 'app-place-table',
  templateUrl: './place-table.component.html',
  styleUrls: ['./place-table.component.scss']
})
export class PlaceTableComponent {

  Emoji = Emoji;
  OverviewType = OverviewType;
  faEdit = faEdit;
  faEye = faEye;
  faMagnifyingGlass = faMagnifyingGlass
  faRemove = faRemove;
  listParams = new ListParams();

  cachedDistances = {};
  cachedDishesCount = {};
  cachedFoodRating = {};

  constructor(
    private firestorePlaceDataService: FirestorePlaceDataService,
    private firestoreFoodDataService: FirestoreFoodDataService,
    private modalService: NgbModal,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private locationService: LocationService,
    private googlePhotosService: GooglePhotosService
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
    const modalRef = this.modalService.open(ConfirmModalComponent, { centered: true, size: 'md' });
    (modalRef.componentInstance as ConfirmModalComponent).itemName = 'place';
    modalRef.result.then(result => {
      if (result) {
        this.firestorePlaceDataService.delete(id).subscribe();
      }
    }).catch(() => {});
  }

  goToDetails(place: Place): void {
    this.router.navigate([place.id], { relativeTo: this.activatedRoute }).then(() => {});
  }

  getItemDistance(item: Place): Observable<number> {
    if (!Object.keys(this.cachedDistances).length || !this.cachedDistances[item.id]) {
      this.cachedDistances[item.id] = this.locationService.getDistance({ latitude: item.address.lat, longitude: item.address.lon });
    }
    return this.cachedDistances[item.id];
  }

  getDishesCount(place: Place): Observable<number> {
    if (!Object.keys(this.cachedDishesCount).length || !this.cachedDishesCount[place.id]) {
      this.cachedDishesCount[place.id] = this.firestoreFoodDataService.getAll(
        undefined, undefined, new ListParams(
          new SortingParams(),
          new FilterParams('placeId', place.id),
          new PaginationParams(0)
        )
      ).pipe(
        map(response => response.items.length)
      )
    }
    return this.cachedDishesCount[place.id];
  }

  getFoodRating(place: Place): Observable<number> {
    if (!Object.keys(this.cachedFoodRating).length || !this.cachedFoodRating[place.id]) {
      this.cachedFoodRating[place.id] = this.firestoreFoodDataService.getAll(
        undefined, undefined, new ListParams(
          new SortingParams(),
          new FilterParams('placeId', place.id),
          new PaginationParams(0)
        )
      ).pipe(
        map(response => response.items.map(item => (item as Food).averageRating)),
        map(response => {
          const count = response.length;
          if (count > 0) {
            return response.reduce((sum: number, val: number) => sum + val, 0) / response.length;
          }
          return 0;
        })
      )
    }
    return this.cachedFoodRating[place.id];
  }

  showThumbnail(place: Place): void {
    const modalRef = this.modalService.open(ImagePreviewComponent, { centered: true, size: 'lg' });
    (modalRef.componentInstance as ImagePreviewComponent).getPhotoUrl = () =>
      this.googlePhotosService.get(place.photoId!).pipe(
        map(photo => photo.baseUrl)
      );
    modalRef.result.then(() => {}).catch(() => {});
  }

  refresh(): void {
    this.locationService.updateCurrentLocation().subscribe(() => this.cachedDistances = {});
  }

  search(phrase?: string): void {
    this.listParams.filters.value = phrase;
    this.firestorePlaceDataService.dataChanged.next(undefined);
  }
}
