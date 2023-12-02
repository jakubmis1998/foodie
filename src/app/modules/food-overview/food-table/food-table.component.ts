import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { Emoji } from '../../../models/emoji';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { faRemove, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { ListParams } from '../../../models/list-params';
import { CreateEditFoodComponent } from '../create-edit-food/create-edit-food.component';
import { Food } from '../../../models/food';
import { FirestoreFoodDataService } from '../../../services/firestore-data/firestore-food-data.service';
import { OverviewType } from '../../../models/utils';
import { FirestorePlaceDataService } from '../../../services/firestore-data/firestore-place-data.service';
import { map, Observable } from 'rxjs';
import { Place } from '../../../models/place';

@Component({
  selector: 'app-food-table',
  templateUrl: './food-table.component.html',
  styleUrls: ['./food-table.component.scss']
})
export class FoodTableComponent {

  OverviewType = OverviewType;
  Emoji = Emoji;
  faEdit = faEdit;
  faMagnifyingGlass = faMagnifyingGlass
  faRemove = faRemove;
  listParams = new ListParams();
  cachedAddresses = {};

  constructor(
    private firestoreFoodDataService: FirestoreFoodDataService,
    private firestorePlaceDataService: FirestorePlaceDataService,
    private modalService: NgbModal,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  createFood(): void {
    this.modalService.open(CreateEditFoodComponent, { centered: true }).result.catch(() => {});
  }

  updateFood(id: string): void {
    const modalRef = this.modalService.open(CreateEditFoodComponent, { centered: true });
    (modalRef.componentInstance as CreateEditFoodComponent).foodId = id;
    modalRef.result.then(() => {
      delete this.cachedAddresses[id];
    }).catch(() => {});
  }

  deleteFood(id: string): void {
    const modalRef = this.modalService.open(ConfirmModalComponent, { centered: true, size: 'md' });
    (modalRef.componentInstance as ConfirmModalComponent).itemName = 'food';
    modalRef.result.then(result => {
      if (result) {
        this.firestoreFoodDataService.delete(id).subscribe();
        delete this.cachedAddresses[id];
      }
    }).catch(() => {});
  }

  goToDetails(food: Food): void {
    this.router.navigate([food.id], { relativeTo: this.activatedRoute }).then(() => {});
  }

  search(phrase?: string): void {
    this.listParams.filters.value = phrase;
    this.firestoreFoodDataService.dataChanged.next(undefined);
  }

  getItemAddress(food: Food): Observable<string> {
    if (!Object.keys(this.cachedAddresses).length || !this.cachedAddresses[food.id]) {
      this.cachedAddresses[food.id] = this.firestorePlaceDataService.get(food.placeId).pipe(
        map(place => place as Place),
        map((place: Place) => {
          const address = place.address?.address;
          let string = address.name || place.name;
          if (address?.city) {
            string = `${string} - ${address.city}`;
          }
          if (address?.road) {
            string = `${string}, ${address.road} ${address.house_number}`;
          }
          return string;
        })
      );
    }
    return this.cachedAddresses[food.id];
  }
}
