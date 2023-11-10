import { Component, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FirestoreDataService } from '../../../services/firestore-data.service';
import { Place } from '../../../models/place';
import { DocumentData, QueryDocumentSnapshot } from '../../../models/firebaseModel';
import { Object } from '../../../models/utils';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-data-overview',
  templateUrl: './data-overview.component.html',
  styleUrls: ['./data-overview.component.scss']
})
export class DataOverviewComponent implements OnInit, OnDestroy {

  @Input() itemTemplate: TemplateRef<any>;

  items: Object[];
  docs: QueryDocumentSnapshot<DocumentData>[];
  loading = true;
  dataChangedSubscription: Subscription;

  constructor(private firestoreDataService: FirestoreDataService) {}

  ngOnInit(): void {
    this.changePage();
    this.dataChangedSubscription = this.firestoreDataService.dataChanged.subscribe(() => this.changePage());
  }

  changePage(direction?: 'prev' | 'next'): void {
    this.loading = true;
    const isNext = direction === 'next';
    this.firestoreDataService.getAll(
      direction ? this.docs?.[isNext ? this.docs.length - 1 : 0] : undefined,
      direction ? !isNext : isNext
    ).subscribe(data => {
      if (data.docs.length) {
        this.docs = data.docs;
        this.items = data.items as Place[];
      }
      this.loading = false;
    }, () => this.loading = false);
  }

  getItemContext(item: Object): { $implicit: Object } {
    return { $implicit: item };
  }

  ngOnDestroy(): void {
    this.dataChangedSubscription?.unsubscribe();
  }
}
