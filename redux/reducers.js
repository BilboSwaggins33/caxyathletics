import {
  RESET_POINTS,
  SET_MAX_POINTS,
  SET_REWARD_INFO,
  SET_REWARD_REDEEM,
  SET_USER,
  SET_USER_POINTS,
  SET_LOCATION
} from "./actions";

const initialState = {
  user: null,
  // set to the users current points
  points: 0,
  rewardInfo: null,
  reedeemed: false,
  location: false
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
    case SET_REWARD_INFO:
      return { ...state, rewardInfo: action.payload };
    case SET_REWARD_REDEEM:
      return { ...state, reedeemed: action.payload };
    case SET_LOCATION:
      return { ...state, location: action.payload }
    default:
      return state;
  }
}

export default userReducer;
