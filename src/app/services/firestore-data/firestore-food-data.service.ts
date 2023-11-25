import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore'; // Required for side-effects
import {
  CollectionReference
} from '../../models/firebaseModel';
import { FirestoreDataAbstractService } from './firestore-data-abstract.service';
import { OverviewType } from '../../models/utils';

@Injectable()
export class FirestoreFoodDataService extends FirestoreDataAbstractService {

  private collection: CollectionReference

  constructor(toastrService: ToastrService) {
    super(toastrService);
  }

  protected getCollection(): CollectionReference {
    if(!this.collection) {
      this.collection = firebase.firestore().collection(OverviewType.FOOD);
    }
    return this.collection;
  }
}
