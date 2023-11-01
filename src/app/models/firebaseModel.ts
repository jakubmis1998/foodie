import firebase from 'firebase/compat';

export type User = firebase.User | null;
export type UpdateData = firebase.firestore.UpdateData;
export type UserCredential = firebase.auth.UserCredential;
export type FirestoreDB = firebase.firestore.Firestore;
export type CollectionReference = firebase.firestore.CollectionReference;
