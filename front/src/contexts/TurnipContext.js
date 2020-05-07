import React, { useReducer, useEffect, useContext } from "react";

import { AppContext } from './';
import { fetchAllTrends, fetchTrend } from '../services';
import { getLastSunday, formatAvatarData } from '../utils';

let reducer = (state, action) => {
  switch (action.type) {
    case "SET_TRENDS":
      return { ...state, trends: action.trends };
    case "SET_SELF_TREND":
      return { ...state, selfTrend: formatAvatarData(action.trend) };
    // case "SET_NEW_VERSION":
    //   return setVersion(state, action.currentVersion);
    // case "VALID_VERSION":
    //   return { ...state, currentVersion: null };
    case "SET_DISABLE_TRENDS_LOADING":
      return { ...state, isLoadingTrends: action.isLoading };
    case "SET_DISABLE_SELF_TREND_LOADING":
      return { ...state, isLoadingSelfTrend: action.isLoading };
    default:
      return state;
  }
};

// const setUser = (state, user) => ({
//   ...state,
//   currentUser: user,
//   isAutoConnecting: false,
// });

// const setVersion = (state, currentVersion) => ({
//   ...state,
//   currentVersion,
// });

// const logout = async (state) => {
//   await logOutUser();

//   return {
//     ...state,
//     currentUser: null,
//     isAutoConnecting: true,
//   };
// };

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

        // const trends = await fetchAllTrends(getLastSunday());

        dispatch({ type: "SET_TRENDS", trends });

      } catch (err) {
        console.log(err);
      } finally {
        dispatch({ type: "SET_DISABLE_TRENDS_LOADING", isLoading: false });
      }
    }

    initiateTrends();
  }, []);

  useEffect(() => {
    async function initiateSelfTrend() {
      try {
        const trend = await fetchTrend(currentUser._id, getLastSunday());
        console.log(trend);

        dispatch({ type: "SET_SELF_TREND", trend });

      } catch (err) {
        console.log(err);
      } finally {
        dispatch({ type: "SET_DISABLE_SELF_TREND_LOADING", isLoading: false });
      }
    }

    initiateSelfTrend();
  }, [currentUser]);

  return (
    <TurnipContext.Provider value={{ state, dispatch }}>
      {props.children}
    </TurnipContext.Provider>
  );
}
export { TurnipContext, TurnipProvider };
