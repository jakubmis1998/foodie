import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateEditPlaceComponent } from '../create-edit-place/create-edit-place.component';
import { Emoji } from '../../../models/emoji';
import { Place } from '../../../models/place';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { faRemove, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { LocationService } from '../../../services/location.service';
import { Observable } from 'rxjs';
import { ListParams } from '../../../models/list-params';
import { FirestorePlaceDataService } from '../../../services/firestore-data/firestore-place-data.service';
import { OverviewType } from '../../../models/utils';

@Component({
  selector: 'app-place-table',
  templateUrl: './place-table.component.html',
  styleUrls: ['./place-table.component.scss']
})
export class PlaceTableComponent {

  Emoji = Emoji;
  OverviewType = OverviewType;
  faEdit = faEdit;
  faMagnifyingGlass = faMagnifyingGlass
  faRemove = faRemove;
  listParams = new ListParams();

  cachedDistances = {};

  constructor(
    public firestorePlaceDataService: FirestorePlaceDataService,
    private modalService: NgbModal,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private locationService: LocationService
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

  refresh(): void {
    this.locationService.updateCurrentLocation().subscribe(() => this.cachedDistances = {});
  }

  search(phrase?: string): void {
    this.listParams.filters.value = phrase;
    this.firestorePlaceDataService.dataChanged.next(undefined);
  }
}
