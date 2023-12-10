import { Component } from '@angular/core';
import { FilterParams, ListParams, PaginationParams, SortingParams } from '../../../models/list-params';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { Emoji } from '../../../models/emoji';
import { OverviewType } from '../../../models/utils';
import { FirestoreConstantsDataService } from '../../../services/firestore-data/firestore-constants-data.service';
import { CreateEditConstantComponent } from '../create-edit-constant/create-edit-constant.component';
import { Constant, ConstantType } from '../../../models/constant';
import { faRemove } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-constants-table',
  templateUrl: './constants-table.component.html',
  styleUrls: ['./constants-table.component.scss']
})
export class ConstantsTableComponent {

  Emoji = Emoji;
  OverviewType = OverviewType;
  ConstantType = ConstantType;
  faRemove = faRemove;
  placeListParams = new ListParams(
    new SortingParams('name'),
    new FilterParams('type', ConstantType.PLACE_TYPE),
    new PaginationParams(0)
  );
  foodListParams = new ListParams(
    new SortingParams('category'),
    new FilterParams('type', ConstantType.FOOD_TYPE),
    new PaginationParams(0)
  );

  constructor(
    public firestoreConstantsDataService: FirestoreConstantsDataService,
    private modalService: NgbModal
  ) {}

  createConstant(constantType: ConstantType): void {
    const modalRef = this.modalService.open(CreateEditConstantComponent, { centered: true, size: 'lg' });
    (modalRef.componentInstance as CreateEditConstantComponent).constantType = constantType;
    modalRef.result.catch(() => {});
  }

  updateConstant(constant: Constant): void {
    const modalRef = this.modalService.open(CreateEditConstantComponent, { centered: true, size: 'lg' });
    (modalRef.componentInstance as CreateEditConstantComponent).constant = constant;
    (modalRef.componentInstance as CreateEditConstantComponent).constantType = constant.type;
    modalRef.result.catch(() => {});
  }

  deleteConstant(id: string): void {
    const modalRef = this.modalService.open(ConfirmModalComponent, { centered: true, size: 'md' });
    (modalRef.componentInstance as ConfirmModalComponent).itemName = 'constant';
    modalRef.result.then(result => {
      if (result) {
        this.firestoreConstantsDataService.delete(id).subscribe();
      }
    }).catch(() => {});
  }
}
