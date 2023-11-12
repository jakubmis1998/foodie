import { DocumentData, QueryDocumentSnapshot } from './firebaseModel';

export type ObjectType = { [x: string]: any };
export type ListResponse = {
  docs: QueryDocumentSnapshot<DocumentData>[];
  items: ObjectType[];
}
