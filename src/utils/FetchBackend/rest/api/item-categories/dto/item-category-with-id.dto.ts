import ItemCategoryDto from './item-category.dto';

export default interface ItemCategoryWithIdDto extends ItemCategoryDto {
  dp_id: number;
}
