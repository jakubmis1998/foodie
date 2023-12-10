import { Injectable } from '@angular/core';
import { catchError, from, map, Observable, Subject, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import 'firebase/compat/firestore'; // Required for side-effects
import {
  CollectionReference,
  DocumentData,
  Query,
  QueryDocumentSnapshot,
  QuerySnapshot
} from '../../models/firebaseModel';
import { ObjectType } from '../../models/utils';
import { ListParams, ListResponse, SortDirection } from '../../models/list-params';

@Injectable()
export abstract class FirestoreDataAbstractService {

  dataChanged = new Subject();

  protected constructor(
    private toastrService: ToastrService
  ) {}

  public getAll(
    latestDoc?: QueryDocumentSnapshot<DocumentData> | undefined, reversed = false, listParams = new ListParams()
  ): Observable<ListResponse> {
    const collection = this.getCollection();
    let paginated: Query<DocumentData>;
    // Filters available without ordering
    if (listParams.filters.value) {
      paginated = collection.where(
        listParams.filters.column,
        listParams.filters.column === 'tags' ? 'array-contains' : '==',
        listParams.filters.value
      );
    } else {
      const orderedBy = collection.orderBy(listParams.sorting.column, listParams.sorting.direction);
      const columnValue = latestDoc?.data()[listParams.sorting.column];
      paginated = reversed ?
        orderedBy.endBefore(columnValue) :
        orderedBy.startAfter(columnValue || listParams.sorting.comparativeValue);
    }

    let limited: Query<DocumentData>;
    if (listParams.pagination.pageSize > 0) {
      limited = reversed ? paginated.limitToLast(listParams.pagination.pageSize) : paginated.limit(listParams.pagination.pageSize);
    } else {
      limited = paginated;
    }

    const isSortingDesc = listParams.sorting.direction === SortDirection.DESC;
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
      map((data: ListResponse) => {
        if (listParams.sorting.column !== 'changedAt') {
          data.items = data.items.sort(
            (a: ObjectType, b: ObjectType) => a[listParams.sorting.column] > b[listParams.sorting.column] ? isSortingDesc ? 1 : -1 : isSortingDesc ? -1 : 1
          );
        }
        return data;
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

  public get(id: string): Observable<ObjectType> {
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

  public create(data: ObjectType): Observable<void> {
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

  public update(id: string, data: ObjectType): Observable<void> {
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

  public delete(id: string): Observable<void> {
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

  protected abstract getCollection(): CollectionReference;
}
