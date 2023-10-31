import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from './services/auth.service';
import { Firestore, addDoc, collection, getDocs, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { User, UpdateData } from './models/firebaseModel';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private fireAuth: AngularFireAuth,
    private authService: AuthService,
    private firestore: Firestore
  ) {}


  ngOnInit(): void {
    this.fireAuth.authState.subscribe((user: User) => {
      this.authService.userChanged(user);
      console.log("authState changed. Email: ", user);
    });

    // this.getData();
  }

  addData(f: any): void {
    const collectionInstance = collection(this.firestore, 'users');
    addDoc(collectionInstance, f.value).then(() => {
      console.log("Added");
    },
    error => console.log("error", error));
  }

  getData() {
    const collectionInstance = collection(this.firestore, 'users');
    getDocs(collectionInstance).then(
      data => {
        const dane = data.docs.map(d => {
            return {
              id: d.id,
              ...d.data()
            };
          }
        );
        console.log("Fetched", dane);
      },
      error => console.log(error)
    );
  }

  update(id = "AELv0BcpPkjeXamH5hum") {
    const docInstance = doc(this.firestore, 'users', id);
    const updatedData = {
      name: "jakubson"
    } as UpdateData;
    updateDoc(docInstance, updatedData).then(
      () => {
        console.log("Updated");
      },
      error => console.log(error)
    );
  }

  delete(id = "AELv0BcpPkjeXamH5hum") {
    const docInstance = doc(this.firestore, 'users', id);
    deleteDoc(docInstance).then(result => {
      console.log("Deleted", result);
    }, error => console.log(error));
  }
}
