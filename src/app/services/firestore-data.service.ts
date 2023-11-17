import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, from, map, Observable, Subject, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore'; // Required for side-effects
import { CollectionReference, DocumentData, QueryDocumentSnapshot } from '../models/firebaseModel';
import { ListResponse, ObjectType } from '../models/utils';
import { SortingSettings } from '../models/sort';
import { query, where } from "firebase/firestore";
import FieldPath = firebase.firestore.FieldPath;
// import { where, or } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreDataService {

  private collection: CollectionReference
  dataChanged = new Subject();

  constructor(
    private toastrService: ToastrService,
    private router: Router
  ) {}

  getAll(
    latestDoc?: QueryDocumentSnapshot<DocumentData> | undefined, reversed = false, sortingSettings = new SortingSettings(), pageSize = 9
  ): Observable<ListResponse> {
    const call = this.getCollection().orderBy(new FieldPath(...sortingSettings.column), sortingSettings.direction);

    const columnValue = latestDoc?.data()[sortingSettings.column[0]];
    const paginated = reversed ?
      call.endBefore(columnValue) :
      call.startAfter(columnValue || sortingSettings.alternativeValue);

    let limited = reversed ? paginated.limitToLast(pageSize) : paginated.limit(pageSize);

    // Filtrowanie wyłącza sortowanie
    // limited = this.getCollection().where('tags', 'array-contains', 'mniam'); // Filtr tagów
    // limited = this.getCollection().orderBy('name').startAt('KF').endAt('KF' + '\uf8ff'); // Filtr po nazwie
    // limited = this.getCollection().orderBy('address.address.city').startAt('Wro'.toUpperCase()).endAt('Wro'.toLowerCase() + '\uf8ff'); // Filtr po mieście
    limited = this.getCollection().where('tags', 'array-contains', 'pierogi');
    // Pomysl - (hidden) tagi małymi literami, wrzucać od razu tagi związane z nazwą (np. pierogarnia, stary, młyn) - szukać nazwę po tagach
    // Co z McDonald jesli jest to jedno slowo
    // Filter by keyword - na podstawie hidden tagów (tam wrzucić człony nazwy, adresu)
    // Filter startsWith - użyć tego startAt i endAt

    return from(limited.get()).pipe(
      map(data => {
        return {
          docs: data.docs,
          items: data.docs.map(doc => {
            const docData = doc.data();
            docData.createdAt = docData.createdAt.toDate();
            docData.changedAt = docData.changedAt.toDate();
            return {
              id: doc.id,
              ...docData
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
      map(doc => doc.data() as DocumentData),
      map(doc => {
        doc.createdAt = doc.createdAt.toDate();
        doc.changedAt = doc.changedAt.toDate();
        return doc;
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
