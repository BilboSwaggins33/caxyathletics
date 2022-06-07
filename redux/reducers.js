import {
  RESET_POINTS,
  SET_MAX_POINTS,
  SET_USER,
  SET_USER_POINTS,
} from "./actions";

const initialState = {
  user: null,
  // set to the users current points
  points: 0,
};

function userReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case SET_USER_POINTS:
      return { ...state, points: action.payload };
    case RESET_POINTS:
      return { ...state, points: 0 };
    case SET_MAX_POINTS:
      return { ...state, points: 1000 };
    default:
      return state;
  }
}

export default userReducer;
