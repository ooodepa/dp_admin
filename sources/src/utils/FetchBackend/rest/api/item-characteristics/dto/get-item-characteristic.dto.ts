import ItemCharacteristicWithIdDto from './item-characteristic-with-id.dto';

export default interface GetItemCharacteristicDto
  extends ItemCharacteristicWithIdDto {
  dp_id: number;
}
