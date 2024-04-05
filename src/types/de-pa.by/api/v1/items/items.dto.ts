export interface ItemCharacteristicsDto {
  dp_characteristicId: number;
  dp_value: string;
}

export interface ItemCharacteristicsWithIdDto extends ItemCharacteristicsDto {
  dp_id: number;
  dp_itemId: string;
}

export interface ItemGalery {
  dp_photoUrl: string;
}

export interface ItemGaleryWithIdDto extends ItemGalery {
  dp_id: number;
  dp_itemId: string;
}

export interface ItemDto {
  dp_1cCode: string;
  dp_1cDescription: string;
  dp_1cIsFolder: boolean;
  dp_1cParentId: string;
  dp_seoTitle: string;
  dp_seoDescription: string;
  dp_seoKeywords: string;
  dp_seoUrlSegment: string;
  dp_textCharacteristics: string;
  dp_photos: string;
  dp_photos360: string;
  dp_photoUrl: string;
  dp_wholesaleQuantity: number;
  dp_brand: string;
  dp_combinedName: string;
  dp_vendorIds: string;
  dp_barcodes: string;
  dp_length: number;
  dp_width: number;
  dp_height: number;
  dp_weight: number;
  dp_cost: number;
  dp_currancy: string;
  dp_sortingIndex: number;
  dp_youtubeIds: string;
  dp_isHidden: boolean;
  dp_itemCategoryId: number;
  dp_id: string;
  dp_itemCharacteristics: ItemCharacteristicsDto[] | undefined;
  dp_itemGalery: ItemGalery[] | undefined;
}

export interface ItemWithIdDto extends ItemDto {
  dp_id: string;
  dp_itemCharacteristics: ItemCharacteristicsWithIdDto[] | undefined;
  dp_itemGalery: ItemGaleryWithIdDto[] | undefined;
}

export const emptyItem: ItemWithIdDto = {
  dp_id: '',
  dp_1cCode: '',
  dp_1cDescription: '',
  dp_1cIsFolder: false,
  dp_1cParentId: '',
  dp_seoTitle: '',
  dp_seoDescription: '',
  dp_seoKeywords: '',
  dp_seoUrlSegment: '',
  dp_textCharacteristics: '',
  dp_photos: '',
  dp_photos360: '',
  dp_photoUrl: '',
  dp_wholesaleQuantity: 0,
  dp_brand: '',
  dp_combinedName: '',
  dp_vendorIds: '',
  dp_barcodes: '',
  dp_length: 0,
  dp_width: 0,
  dp_height: 0,
  dp_weight: 0,
  dp_cost: 0,
  dp_currancy: '',
  dp_sortingIndex: 0,
  dp_youtubeIds: '',
  dp_isHidden: false,
  dp_itemCategoryId: 0,
  dp_itemCharacteristics: undefined,
  dp_itemGalery: undefined,
};
