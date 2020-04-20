import React, { useReducer, useContext, useEffect } from "react";
import axios from "axios";

let reducer = (state, action) => {
  // const { some } = state;

  switch (action.type) {
    case "LOG_IN":
      return login(state, action.userdata);
    case "SIGN_UP":
      return signup(state, action.userdata);
    case "LOG_OUT":
      return logout(state);
    default:
      return state;
  }
};

const login = (state, { pseudo, password }) => {
  console.log("connecting");
  axios
    .post("/api/auth/login", {
      pseudo,
      password,
    })
    .then((data) => console.log(data))
    .catch((err) => console.log(err));

  return {
    ...state,
    isConnecting: false,
    error: "",
  };
};

const signup = async (state, { pseudo, password, islandName }) => {
  // try {
  console.log("connecting");
  axios
    .post("/api/auth/signin", {
      pseudo,
      password,
      islandName,
    })
    .then((data) => {
      return {
        ...state,
        isConnecting: false,
        error: "",
        user: data.user,
      };
    })
    .catch((err) => console.log(err));

  // dispatch({ type: "SET_USER", user });
  // } catch (err) {
  //   console.log(err);
  // }

  return {
    ...state,
    isConnecting: false,
    error: "",
  };
};

const logout = async (state) => {
  await axios.post("/api/auth/logout");

  return {
    ...state,
    currentUser: null,
  };
};

const initialState = {
  isAutoConnecting: true,
  isConnecting: false,
  error: "",
  user: null,
};

const AuthContext = React.createContext(initialState);

function AuthProvider(props) {
  const {
    state: { currentUser },
    // dispatch,
  } = useContext(AppContext);

  const [state, dispatch] = useReducer(reducer, initialState);
  console.log(state);
  useEffect(() => console.log(state.user), [state.user]);
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {props.children}
    </AuthContext.Provider>
  );
}
export { AuthContext, AuthProvider };
