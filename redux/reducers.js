import { rewardsList } from "../Data/rewards";

import { RESET_POINTS, SET_MAX_POINTS, SET_USER, SET_USER_POINTS, SET_LOCATION } from "./actions";

const initialState = {
  user: null,
  // set to the users current points
  points: 0,
  rewardInfo: null,
  redeemedInfo: Array(rewardsList.length).fill(false),
  location: false,
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
    case SET_LOCATION:
      return { ...state, location: action.payload };
    default:
      return state;
  }
}

export default userReducer;
