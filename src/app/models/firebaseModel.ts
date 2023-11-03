import firebase from 'firebase/compat';

export type User = firebase.User | null;
export type UpdateData = firebase.firestore.UpdateData;
export type UserCredential = firebase.auth.UserCredential;
export type CollectionReference = firebase.firestore.CollectionReference;
export type QuerySnapshot<T> = firebase.firestore.QuerySnapshot<T>;
export type DocumentData = firebase.firestore.DocumentData;
export type QueryDocumentSnapshot<T> = firebase.firestore.QueryDocumentSnapshot<T>;
