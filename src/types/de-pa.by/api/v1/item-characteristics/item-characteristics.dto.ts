export interface ItemCharacteristicDto {
  dp_name: string;
  dp_unit: string;
  dp_sortingIndex: number;
  dp_isHidden: boolean;
  dp_isFolder: boolean;
  dp_parentId: number;
}

export interface ItemCharacteristicWithIdDto extends ItemCharacteristicDto {
  dp_id: number;
}

export const emptyItemCharacteristic = {
  dp_id: 0,
  dp_name: '',
  dp_unit: '',
  dp_sortingIndex: 0,
  dp_isHidden: false,
  dp_isFolder: false,
  dp_parentId: 0,
};
