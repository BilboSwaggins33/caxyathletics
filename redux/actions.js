export const SET_USER_POINTS = "SET_USER_POINTS";
export const SET_USER = "SET_USER";
export const RESET_POINTS = "RESET_POINTS";
export const SET_MAX_POINTS = "SET_MAX_POINTS";

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
