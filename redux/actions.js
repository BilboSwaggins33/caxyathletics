export const SET_USER_POINTS = "SET_USER_POINTS";
export const SET_USER = "SET_USER";
export const RESET_POINTS = "RESET_POINTS";
export const SET_MAX_POINTS = "SET_MAX_POINTS";
export const SET_REWARD_INFO = "SET_REWARD_INFO";
export const SET_REWARD_REDEEM = "SET_REWARD_REDEEM";

export const setPoints = (points, addedPoints) => {
  return {
    type: SET_USER_POINTS,
    payload: points + addedPoints,
  };
};

export const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user,
  };
};

export const resetPoints = (points) => {
  return {
    type: RESET_POINTS,
    payload: points,
  };
};

export const setMaxPoints = (points) => {
  return {
    type: SET_MAX_POINTS,
    payload: points,
  };
};

export const setRewardInfo = (rewardInfo) => {
  return {
    type: SET_REWARD_INFO,
    payload: rewardInfo,
  };
};

export const setRewardRedeem = (redeemed) => {
  return {
    type: SET_REWARD_REDEEM,
    payload: !redeemed,
  };
};
