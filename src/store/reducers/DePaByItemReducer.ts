import { emptyItem } from '../../types/de-pa.by/api/v1/items/items.dto';
import {
  DePaByItemAction,
  DePaByItemState,
  DePaByItemTypes,
} from '../../types/de-pa.by/DePaByItemReducer';

const defaultStore: DePaByItemState = {
  item: {
    data: emptyItem,
    isLoading: false,
    isNotFound: false,
    error: null,
  },
  items: {
    data: [],
    isLoading: false,
    error: null,
  },
};

export function DePaByItemReducer(
  state = defaultStore,
  action: DePaByItemAction,
): DePaByItemState {
  switch (action.type) {
    case DePaByItemTypes.FETCH_DEPABY_ITEM:
      return {
        ...state,
        item: {
          data: emptyItem,
          isLoading: false,
          isNotFound: false,
          error: null,
        },
      };
    case DePaByItemTypes.FETCH_DEPABY_ITEM_SUCCESS:
      return {
        ...state,
        item: {
          data: action.payload,
          isLoading: false,
          isNotFound: false,
          error: null,
        },
      };
    case DePaByItemTypes.FETCH_DEPABY_ITEM_LOADING:
      return {
        ...state,
        item: {
          data: emptyItem,
          isLoading: true,
          isNotFound: false,
          error: null,
        },
      };
    case DePaByItemTypes.FETCH_DEPABY_ITEM_NOT_FOUND:
      return {
        ...state,
        item: {
          data: emptyItem,
          isLoading: false,
          isNotFound: true,
          error: null,
        },
      };
    case DePaByItemTypes.FETCH_DEPABY_ITEM_ERROR:
      return {
        ...state,
        item: {
          data: emptyItem,
          isLoading: false,
          isNotFound: false,
          error: action.payload,
        },
      };
    case DePaByItemTypes.FETCH_DEPABY_ITEMS:
      return {
        ...state,
        items: {
          data: [],
          isLoading: false,
          error: null,
        },
      };
    case DePaByItemTypes.FETCH_DEPABY_ITEMS_SUCCESS:
      return {
        ...state,
        items: {
          data: action.payload,
          isLoading: false,
          error: null,
        },
      };
    case DePaByItemTypes.FETCH_DEPABY_ITEMS_LOADING:
      return {
        ...state,
        items: {
          data: [],
          isLoading: true,
          error: null,
        },
      };
    case DePaByItemTypes.FETCH_DEPABY_ITEMS_ERROR:
      return {
        ...state,
        items: {
          data: [],
          isLoading: false,
          error: action.payload,
        },
      };
    default:
      return state;
  }
}
