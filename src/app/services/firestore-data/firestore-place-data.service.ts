import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, from, map, Observable, Subject, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore'; // Required for side-effects
import {
  CollectionReference,
  DocumentData,
  Query,
  QueryDocumentSnapshot,
  QuerySnapshot
} from '../models/firebaseModel';
import { ObjectType } from '../models/utils';
import { ListParams, ListResponse } from '../models/list-params';

@Injectable()
export class FirestoreDataService {

  private collection: CollectionReference
  dataChanged = new Subject();

  constructor(
    private toastrService: ToastrService,
    private router: Router
  ) {}

  getAll(
    latestDoc?: QueryDocumentSnapshot<DocumentData> | undefined, reversed = false, listParams = new ListParams()
  ): Observable<ListResponse> {
    const collection = this.getCollection();

    let paginated: Query<DocumentData>;
    // Filters available without ordering
    if (listParams.filters.value) {
      paginated = collection.where('tags', 'array-contains', listParams.filters.value);
    } else {
      const orderedBy = collection.orderBy(listParams.sorting.column, listParams.sorting.direction);
      const columnValue = latestDoc?.data()[listParams.sorting.column];
      paginated = reversed ?
        orderedBy.endBefore(columnValue) :
        orderedBy.startAfter(columnValue || listParams.sorting.comparativeValue);
    }

    const limited = reversed ? paginated.limitToLast(listParams.pagination.pageSize) : paginated.limit(listParams.pagination.pageSize);

    return from(limited.get()).pipe(
      map((data: QuerySnapshot<DocumentData>) => {
        return {
          docs: data.docs,
          items: data.docs.map(doc => {
            return {
              id: doc.id,
              ...doc.data() as DocumentData
            };
          })
        };
      }),
      tap(result => {
        if (!result.docs.length) {
          this.toastrService.info('There is no more data.', 'Info!')
        }
      }),
      catchError(err => {
        this.toastrService.error(err, 'Error!');
        return err;
      })
    ) as Observable<ListResponse>;
  }

  get(id: string): Observable<ObjectType> {
    return from(this.getCollection().doc(id).get()).pipe(
      map(doc => {
        return {
          id: doc.id,
          ...doc.data() as DocumentData
        }
      }),
      catchError((err) => {
        this.toastrService.error(err, 'Error!');
        return err;
      })
    ) as Observable<DocumentData>;
  }

  create(data: ObjectType): Observable<void> {
    return from(this.getCollection().add(data)).pipe(
      tap(() => {
        this.toastrService.success('Object successfully created.', 'Success!');
        this.dataChanged.next(undefined);
      }),
      map(() => undefined),
      catchError((err) => {
        this.toastrService.error(err, 'Error!');
        return err;
      })
    ) as Observable<void>;
  }

  update(id: string, data: ObjectType): Observable<void> {
    return from(this.getCollection().doc(id).set(data)).pipe(
      tap(() => {
        this.toastrService.success('Object successfully updated.', 'Success!');
        this.dataChanged.next(undefined);
      }),
      catchError((err) => {
        this.toastrService.error(err, 'Error!');
        return err;
      })
    ) as Observable<void>;
  }

  delete(id: string): Observable<void> {
    return from(this.getCollection().doc(id).delete()).pipe(
      tap(() => {
        this.toastrService.success('Object successfully removed.', 'Success!');
        this.dataChanged.next(undefined);
      }),
      catchError((err) => {
        this.toastrService.error(err, 'Error!');
        return err;
      })
    ) as Observable<void>;
  }

  private getCollection(): CollectionReference {
    if(!this.collection) {
      // Get 'x' from 'x-overview'
      const collectionName = this.router.url.split('-')[0];
      this.collection = firebase.firestore().collection(collectionName);
    }
    return this.collection;
  }
}
