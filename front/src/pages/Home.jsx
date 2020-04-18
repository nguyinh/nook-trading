import React, { useEffect, useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import { AppContext } from "../contexts";

const Home = () => {

  const {
    state: { currentUser }
  } = useContext(AppContext);

  return (
    <div>
      {!currentUser ? (
        <Redirect to="/profile" />
      ) : (
        <Redirect to="/market" />
      )}
    </div>
  );
};

export default Home;
