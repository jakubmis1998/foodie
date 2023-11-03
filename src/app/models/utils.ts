import { DocumentData, QueryDocumentSnapshot } from './firebaseModel';

export type Object = { [x: string]: any };
export type ListResponse = {
  docs: QueryDocumentSnapshot<DocumentData>[];
  items: Object[];
}
