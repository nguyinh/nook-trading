import React, { useReducer, useEffect } from "react";
import { connectUser, logOutUser } from "../services";

let reducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return setUser(state, action.user);
    case "SET_NEW_VERSION":
      return setVersion(state, action.currentVersion);
    case "VALID_VERSION":
      return { ...state, currentVersion: null };
    case "DISABLE_LOADING":
      return { ...state, isAutoConnecting: false };
    case "LOG_OUT":
      return logout(state);
    default:
      return state;
  }
};

const setUser = (state, user) => ({
  ...state,
  currentUser: user,
  isAutoConnecting: false,
});

const setVersion = (state, currentVersion) => ({
  ...state,
  currentVersion,
});

const logout = async (state) => {
  await logOutUser();

  return {
    ...state,
    currentUser: null,
    isAutoConnecting: true,
  };
};

const initialState = {
  currentUser: null,
  isAutoConnecting: true,
  currentVersion: null,
};

const AppContext = React.createContext(initialState);

function AppProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    async function connect() {
      try {
        const { user, currentVersion } = await connectUser();

        dispatch({ type: "SET_USER", user });

        // If user connect to a new version, display changelog
        if (currentVersion) {
          console.log("NEW VERSION");
          dispatch({ type: "SET_NEW_VERSION", currentVersion });
        }
      } catch (err) {
        console.log(err);
      } finally {
        dispatch({ type: "DISABLE_LOADING" });
      }
    }

    connect();
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {props.children}
    </AppContext.Provider>
  );
}
export { AppContext, AppProvider };
