import ItemCharacteristicDto from './item-characteristic.dto';

export default interface ItemCharacteristicWithIdDto
  extends ItemCharacteristicDto {
  dp_id: number;
}
