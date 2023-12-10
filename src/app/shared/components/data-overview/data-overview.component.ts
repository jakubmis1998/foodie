import { Component, Injector, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Place } from '../../../models/place';
import { DocumentData, QueryDocumentSnapshot } from '../../../models/firebaseModel';
import { ObjectType, OverviewType } from '../../../models/utils';
import { Subscription } from 'rxjs';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';
import { ListParams } from '../../../models/list-params';
import { Emoji } from '../../../models/emoji';
import { FirestorePlaceDataService } from '../../../services/firestore-data/firestore-place-data.service';
import { FirestoreFoodDataService } from '../../../services/firestore-data/firestore-food-data.service';
import { FirestoreConstantsDataService } from '../../../services/firestore-data/firestore-constants-data.service';

@Component({
  selector: 'app-data-overview',
  templateUrl: './data-overview.component.html',
  styleUrls: ['./data-overview.component.scss']
})
export class DataOverviewComponent implements OnInit, OnDestroy {

  @Input() overviewType: OverviewType;
  @Input() itemTemplate: TemplateRef<any>;
  @Input() listParams: ListParams;
  @Input() refreshCallback: () => void;

  faRefresh = faRefresh;
  items: ObjectType[];
  docs: QueryDocumentSnapshot<DocumentData>[];
  loading = true;
  dataChangedSubscription: Subscription;
  Emoji = Emoji;

  private firestoreDataService: FirestoreFoodDataService | FirestorePlaceDataService | FirestoreConstantsDataService;

  constructor(private injector: Injector) {
  }

  ngOnInit(): void {
    switch (this.overviewType) {
      case OverviewType.PLACES:
        this.firestoreDataService = <FirestorePlaceDataService>this.injector.get(FirestorePlaceDataService);
        break;
      case OverviewType.FOOD:
        this.firestoreDataService = <FirestoreFoodDataService>this.injector.get(FirestoreFoodDataService);
        break;
      case OverviewType.CONSTANTS:
        this.firestoreDataService = <FirestoreConstantsDataService>this.injector.get(FirestoreConstantsDataService);
        break;
    }

    this.changePage();
    this.dataChangedSubscription = this.firestoreDataService.dataChanged.subscribe(() => this.changePage());
  }

  changePage(direction?: 'prev' | 'next'): void {
    this.loading = true;
    const isNext = direction === 'next';
    this.firestoreDataService.getAll(
      direction ? this.docs?.[isNext ? this.docs.length - 1 : 0] : undefined,
      direction ? !isNext : isNext,
      this.listParams
    ).subscribe(data => {
      if (data.docs.length) {
        this.docs = data.docs;
        this.items = data.items as Place[];
      } else {
        // Don't reset when using pagination arrows (Store current data)
        // Reset otherwise (filters, etc.)
        if (!direction) {
          this.docs = [];
          this.items = [];
        }
      }
      this.loading = false;
    }, () => this.loading = false);
  }

  refresh(): void {
    this.refreshCallback();
    this.changePage();
  }

  getItemContext(item: ObjectType): { $implicit: ObjectType } {
    return { $implicit: item };
  }

  ngOnDestroy(): void {
    this.dataChangedSubscription?.unsubscribe();
  }
}
