import { ObjectType } from './utils';

export interface BaseModel {
  id: string;
  createdAt: Date;
  changedAt: Date;
  tags: string[];
}

export function getDefaultTags(item: ObjectType, storeExisting: boolean): string[] {
  let defaultTags = [
    item.name,
    item.address?.name,
    item.address?.category,
    item.address?.addresstype,
    item.address?.type,
    item.address?.address?.neighbourhood,
    item.address?.address?.road,
    item.address?.address?.suburb,
    item.address?.address?.quarter
  ].filter(tag => !!tag).map(
      tag => tag.toString().toLowerCase()
        .replaceAll('_', ' ')
        .replaceAll("'", '')
        .replaceAll(".", '')
        .replaceAll(",", '')
        .replaceAll("-", ' ')
    )
    .flatMap((tag: string) => tag.split(' '));
  const city = item.address?.address?.city;
  if (city) {
    defaultTags.push(city.toString()?.toLowerCase());
  }

  // Remove duplicates
  if (storeExisting) {
    defaultTags = defaultTags.concat(item.tags);
  }
  return [...new Set(defaultTags.filter(tag => !!tag))];
}
