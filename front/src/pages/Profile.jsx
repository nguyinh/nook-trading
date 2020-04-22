import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../contexts";
import { signUpUser, logInUser } from "../services";
import { Button, Form, Header, Loader, Message } from "semantic-ui-react";
import nookTradingBanner from "../res/images/nook-trading-banner.png";
import "./Profile.css";
import { Authentification } from "../components/profile";

const Profile = () => {
  const {
    state: { currentUser, isAutoConnecting },
    dispatch,
  } = useContext(AppContext);

  if (isAutoConnecting)
    return (
      <Loader active inline="centered" size="big" style={{ marginTop: "5rem" }}>
        Chargement de l'app ✋
      </Loader>
    );

  return (
    <>
      {!currentUser ? (
        <div className="profile-container-2">
          
          <Authentification />
          
          <div className="app-presentation">
            <div className="banner-container">
              <img src={nookTradingBanner} id="atnh-banner"></img>
            </div>
          </div>
        </div>
      ) : (
        <div className='logged-profile-container'>
          Salut {currentUser.pseudo} 👋
          <Button
            color="red"
            style={{ marginTop: "3rem" }}
            onClick={() => dispatch({ type: "LOG_OUT" })}
          >
            Déconnexion 👋
          </Button>
          </div>
      )}
    </>
  );
};

export default Profile;
