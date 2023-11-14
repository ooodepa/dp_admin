import ItemDto from './item.dto';

interface ItemCharacteristics {
  dp_id: number;
  dp_itemId: string;
  dp_characteristicId: number;
  dp_value: string;
}

interface ItemGalery {
  dp_id: number;
  dp_itemId: string;
  dp_photoUrl: string;
}

export default interface ItemWithIdDto extends ItemDto {
  dp_id: string;
  dp_itemCharacteristics: ItemCharacteristics[];
  dp_itemGalery: ItemGalery[];
}
