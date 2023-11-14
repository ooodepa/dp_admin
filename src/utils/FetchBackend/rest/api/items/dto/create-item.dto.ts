import ItemDto from './item.dto';

export default interface CreateItemDto extends ItemDto {
  dp_isHidden: boolean;
}
