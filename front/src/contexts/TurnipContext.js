import React, { useReducer, useEffect, useContext } from "react";

import { AppContext } from './';
import { fetchAllTrends } from '../services';
import { getLastSunday, formatAvatarData } from '../utils';

let reducer = (state, action) => {
  switch (action.type) {
    case "SET_TRENDS":
      return { ...state, trends: action.trends.map(formatAvatarData) };
    case "SET_SELF_TREND":
      return { ...state, selfTrend: formatAvatarData(action.trend) };
    case "UPDATE_TREND":
      return updateTrends(state, action.trend);
    case "UPDATE_SELF_TREND":
      return updateSelfTrend(state, action.author);
    case "SET_DISABLE_TRENDS_LOADING":
      return { ...state, isLoadingTrends: action.isLoading };
    case "SET_DISABLE_SELF_TREND_LOADING":
      return { ...state, isLoadingSelfTrend: action.isLoading };
    default:
      return state;
  }
};

const updateTrends = (state, updatedTrend) => ({
  ...state,
  trends: state.trends.map(trend => trend._id === updatedTrend._id ? formatAvatarData(updatedTrend) : trend),
  selfTrend: state.selfTrend._id === updatedTrend._id ? formatAvatarData(updatedTrend) : state.selfTrend,
});

const updateSelfTrend = (state, author) => {
  const selfTrend = state.trends.find((trend) => trend.author._id === author);

  return {
  ...state,
  selfTrend
}};

const initialState = {
  trends: null,
  isLoadingTrends: true,
  selfTrend: null,
  isLoadingSelfTrend: true,
};

const TurnipContext = React.createContext(initialState);

function TurnipProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    state: { currentUser },
  } = useContext(AppContext);

  useEffect(() => {
    async function initiateTrends() {
      try {
        const trends = await fetchAllTrends(getLastSunday());

        dispatch({ type: "SET_TRENDS", trends });

      } catch (err) {
        console.log(err);
      } finally {
        dispatch({ type: "SET_DISABLE_TRENDS_LOADING", isLoading: false });
      }

      dispatch({ type: "UPDATE_SELF_TREND", author: currentUser._id });
      dispatch({ type: "SET_DISABLE_SELF_TREND_LOADING", isLoading: false });
    }

    initiateTrends();
  }, []);

  return (
    <TurnipContext.Provider value={{ state, dispatch }}>
      {props.children}
    </TurnipContext.Provider>
  );
}
export { TurnipContext, TurnipProvider };
