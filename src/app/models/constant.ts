export interface Constant {
  id: string;
  name: string;
  value: string;
  type: ConstantType;
}

export enum ConstantType {
  PLACE_TYPE = 'PLACE_TYPE',
  FOOD_TYPE = 'FOOD_TYPE'
}
