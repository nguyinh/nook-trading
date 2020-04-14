import React, { useEffect, useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import { AppContext } from "../contexts";

const Home = () => {

  const {
    state: { currentUser },
    dispatch,
  } = useContext(AppContext);

  return (
    <div>
      {!currentUser ? (
        <Redirect to="/profile" />
      ) : (
        <h3>Hello {currentUser && currentUser.pseudo}</h3>
      )}
    </div>
  );
};

export default Home;
