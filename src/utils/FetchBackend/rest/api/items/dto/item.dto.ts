interface ItemCharacteristics {
  dp_characteristicId: number;
  dp_value: string;
}

interface ItemGalery {
  dp_photoUrl: string;
}

export default interface ItemDto {
  dp_id?: string;
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
  dp_sortingIndex: number;
  dp_youtubeIds: string;
  dp_barcodes: string;
  dp_length: number;
  dp_width: number;
  dp_height: number;
  dp_weight: number;
  dp_cost: number;
  dp_currancy: string;
  dp_isHidden: boolean;
  dp_itemCategoryId: number;
  dp_itemCharacteristics: ItemCharacteristics[];
  dp_itemGalery: ItemGalery[];
}
