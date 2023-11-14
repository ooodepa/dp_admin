import ItemDto from './item.dto';

export default interface UpdateItemDto extends ItemDto {
  dp_isHidden: boolean;
}
