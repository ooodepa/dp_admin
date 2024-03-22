import { LogicLikeCoursesDto } from './LogicLikeCourses';

export interface LogicLikeState {
  courses: {
    data: LogicLikeCoursesDto[];
    loading: boolean;
    error: string | null;
  };
}

export enum LogicLikeTypes {
  FETCH_LOGICLIKE_COURSES = 'FETCH_LOGICLIKE_COURSES',
  FETCH_LOGICLIKE_COURSES_SUCCESS = 'FETCH_LOGICLIKE_COURSES_SUCCESS',
  FETCH_LOGICLIKE_COURSES_ERROR = 'FETCH_LOGICLIKE_COURSES_ERROR',
}

interface LogicLikeCourses {
  type: LogicLikeTypes.FETCH_LOGICLIKE_COURSES;
}

interface LogicLikeCoursesSuccess {
  type: LogicLikeTypes.FETCH_LOGICLIKE_COURSES_SUCCESS;
  payload: LogicLikeCoursesDto[];
}

interface LogicLikeCoursesError {
  type: LogicLikeTypes.FETCH_LOGICLIKE_COURSES_ERROR;
  payload: string;
}

export type LogicLikeAction =
  | LogicLikeCourses
  | LogicLikeCoursesSuccess
  | LogicLikeCoursesError;
