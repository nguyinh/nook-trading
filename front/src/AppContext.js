import React, { useReducer, useEffect } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://172.20.10.4:2020";

let reducer = (state, action) => {
  // const { some } = state;

  switch (action.type) {
    case "SET_USER":
      return setUser(state, action.user);
    case "DISABLE_LOADING":
      return { ...state, isAutoConnecting: false };
    case "LOG_OUT":
      return logout(state);
    default:
      return state;
  }
};

const setUser = (state, user) => {
  return {
    ...state,
    currentUser: user,
    isAutoConnecting: false,
  };
};

const logout = async (state) => {
  await axios.post("/api/auth/logout");

  return {
    ...state,
    currentUser: null,
    isAutoConnecting: true,
  };
};

const initialState = {
  currentUser: null,
};

const AppContext = React.createContext(initialState);

function AppProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    try {
      async function connect() {
        const {
          data: { user },
        } = await axios.post("/api/auth/connect");
        dispatch({ type: "SET_USER", user });
        dispatch({ type: "DISABLE_LOADING" });
      }

      connect();
    } catch (err) {
      console.log(err);
      dispatch({ type: "DISABLE_LOADING" });
    }
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {props.children}
    </AppContext.Provider>
  );
}
export { AppContext, AppProvider };
