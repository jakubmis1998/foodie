import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { FirestoreDataService } from '../../../services/firestore-data.service';
import { Place } from '../../../models/place';
import { DocumentData, QueryDocumentSnapshot } from '../../../models/firebaseModel';
import { Object } from '../../../models/utils';

@Component({
  selector: 'app-data-overview',
  templateUrl: './data-overview.component.html',
  styleUrls: ['./data-overview.component.scss']
})
export class DataOverviewComponent implements OnInit {

  @Input() itemTemplate: TemplateRef<any>;

  items: Object[];
  docs: QueryDocumentSnapshot<DocumentData>[];
  loading = true;

  constructor(private firestoreDataService: FirestoreDataService) {}

  ngOnInit(): void {
    this.changePage();
  }

  changePage(direction?: 'prev' | 'next'): void {
    this.loading = true;
    const isNext = direction === 'next';
    this.firestoreDataService.getAll(this.docs?.[isNext ? this.docs.length - 1 : 0], direction ? !isNext : isNext).subscribe(data => {
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
}
