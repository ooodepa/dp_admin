import {
  LogicLikeAction,
  LogicLikeState,
  LogicLikeTypes,
} from '../../types/logiclike.com/logiclikeReducer';

const defaultStore: LogicLikeState = {
  courses: {
    data: [],
    loading: false,
    error: null,
  },
};

export function logiclikeReducer(
  state = defaultStore,
  action: LogicLikeAction,
): LogicLikeState {
  switch (action.type) {
    case LogicLikeTypes.FETCH_LOGICLIKE_COURSES:
      return {
        ...state,
        courses: {
          data: [],
          loading: false,
          error: null,
        },
      };
    case LogicLikeTypes.FETCH_LOGICLIKE_COURSES_SUCCESS:
      return {
        ...state,
        courses: {
          data: action.payload,
          loading: false,
          error: null,
        },
      };
    case LogicLikeTypes.FETCH_LOGICLIKE_COURSES_ERROR:
      return {
        ...state,
        courses: {
          data: [],
          loading: false,
          error: action.payload,
        },
      };
    default:
      return state;
  }
}
