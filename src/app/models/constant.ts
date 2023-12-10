export interface Constant {
  id: string;
  name: string;
  category: ConstantCategory; // Only for Food
  type: ConstantType;
}

export enum ConstantCategory {
  DISHES = 'Dishes',
  CATEGORY = 'Category',
  MEAT = 'Meat',
  DAIRY = 'Dairy',
  BREADS = 'Breads',
  PASTAS = 'Pastas',
  CANDIES = 'Candies',
  EXTRAS = 'Extras',
  TASTE = 'Taste'
}

export enum ConstantType {
  PLACE_TYPE = 'PLACE_TYPE',
  FOOD_TYPE = 'FOOD_TYPE'
}
