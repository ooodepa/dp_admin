import { ItemWithIdDto } from './api/v1/items/items.dto';

export interface DePaByItemState {
  items: {
    data: ItemWithIdDto[];
    isLoading: boolean;
    error: string | null;
  };
  item: {
    data: ItemWithIdDto;
    isLoading: boolean;
    isNotFound: boolean;
    error: string | null;
  };
}

export enum DePaByItemTypes {
  FETCH_DEPABY_ITEMS = 'FETCH_DEPABY_ITEMS',
  FETCH_DEPABY_ITEMS_SUCCESS = 'FETCH_DEPABY_ITEMS_SUCCESS',
  FETCH_DEPABY_ITEMS_LOADING = 'FETCH_DEPABY_ITEMS_LOADING',
  FETCH_DEPABY_ITEMS_ERROR = 'FETCH_DEPABY_ITEMS_ERROR',
  FETCH_DEPABY_ITEM = 'FETCH_DEPABY_ITEM',
  FETCH_DEPABY_ITEM_SUCCESS = 'FETCH_DEPABY_ITEM_SUCCESS',
  FETCH_DEPABY_ITEM_LOADING = 'FETCH_DEPABY_ITEM_LOADING',
  FETCH_DEPABY_ITEM_NOT_FOUND = 'FETCH_DEPABY_ITEM_NOT_FOUND',
  FETCH_DEPABY_ITEM_ERROR = 'FETCH_DEPABY_ITEM_ERROR',
}

interface DePaByItems {
  type: DePaByItemTypes.FETCH_DEPABY_ITEMS;
}

interface DePaByItemsSuccess {
  type: DePaByItemTypes.FETCH_DEPABY_ITEMS_SUCCESS;
  payload: ItemWithIdDto[];
}

interface DePaByItemsLoading {
  type: DePaByItemTypes.FETCH_DEPABY_ITEMS_LOADING;
}

interface DePaByItemsError {
  type: DePaByItemTypes.FETCH_DEPABY_ITEMS_ERROR;
  payload: string;
}

interface DePaByItem {
  type: DePaByItemTypes.FETCH_DEPABY_ITEM;
}

interface DePaByItemSuccess {
  type: DePaByItemTypes.FETCH_DEPABY_ITEM_SUCCESS;
  payload: ItemWithIdDto;
}

interface DePaByItemLoading {
  type: DePaByItemTypes.FETCH_DEPABY_ITEM_LOADING;
}

interface DePaByItemNotFound {
  type: DePaByItemTypes.FETCH_DEPABY_ITEM_NOT_FOUND;
}

interface DePaByItemError {
  type: DePaByItemTypes.FETCH_DEPABY_ITEM_ERROR;
  payload: string;
}

export type DePaByItemAction =
  | DePaByItems
  | DePaByItemsSuccess
  | DePaByItemsLoading
  | DePaByItemsError
  | DePaByItem
  | DePaByItemSuccess
  | DePaByItemLoading
  | DePaByItemNotFound
  | DePaByItemError;
