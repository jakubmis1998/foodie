import { Injectable } from '@angular/core';
import { catchError, from, map, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import firebase from "firebase/compat/app";
import 'firebase/compat/firestore'; // Required for side-effects
import { CollectionReference } from '../models/firebaseModel';

@Injectable({
  providedIn: 'root'
})
export class FirestoreDataService<T extends { [x: string]: any; }> {

  public collectionName: string;
  private collection: CollectionReference

  constructor(
    private toastrService: ToastrService
  ) {}

  getAll(): Observable<T[]> {
    return from(this.getCollection().get()).pipe(
      map(data => data.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data()
        } as unknown as T;
      })),
      catchError(err => {
        this.toastrService.error(err, 'Error');
        return err;
      })
    ) as Observable<T[]>;
  }

  create(data: T): Observable<void> {
    return from(this.getCollection().add(data)).pipe(
      catchError((err) => {
        this.toastrService.error(err, 'Error');
        return err;
      })
    ) as Observable<void>;
  }

  update(id: string, data: T): Observable<void> {
    return from(this.getCollection().doc(id).set(data)).pipe(
      catchError((err) => {
        this.toastrService.error(err, 'Error');
        return err;
      })
    ) as Observable<void>;
  }

  delete(id: string): Observable<void> {
    return from(this.getCollection().doc(id).delete()).pipe(
      catchError((err) => {
        this.toastrService.error(err, 'Error');
        return err;
      })
    ) as Observable<void>;
  }

  private getCollection(): CollectionReference {
    if(!this.collection) {
      this.collection = firebase.firestore().collection(this.collectionName);
    }
    return this.collection;
  }
}
