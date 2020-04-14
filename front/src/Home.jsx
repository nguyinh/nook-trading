import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { AppContext } from "./AppContext";
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:2020";
// TODO: handle PROD env

const Home = () => {
  const [isConnecting, setIsConnecting] = useState(true);

  const {
    state: { currentUser },
    dispatch,
  } = useContext(AppContext);

  useEffect(() => {
    async function connect() {
      try {
        const {
          data: { user },
        } = await axios.post("/api/auth/connect");
        dispatch({ type: "SET_USER", user });
        console.log(user);
        setIsConnecting(false);
      } catch (err) {
        console.log(err);
        setIsConnecting(false);
      }
    }

    connect();
  }, []);
  console.log(currentUser);
  console.log(isConnecting);
  return (
    <div>
      {isConnecting ? (
        "loading"
      ) : !currentUser ? (
        <Redirect to="/profile" />
      ) : (
        <h3>Hello {currentUser && currentUser.pseudo}</h3>
      )}
    </div>
  );
};

export default Home;
// <button onClick={logout}>Log out</button>
//   <button onClick={login}>Log in</button>
