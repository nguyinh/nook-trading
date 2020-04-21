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

  const [isConnecting, setIsConnecting] = useState(false);
  const [signType, setSignType] = useState("SIGN_UP");
  const [pseudo, setPseudo] = useState("");
  const [pseudoError, setPseudoError] = useState(null);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);
  const [islandName, setIslandName] = useState("");
  const [islandError, setIslandError] = useState(null);

  const signUp = async () => {
    if (pseudo === "") setPseudoError("Rentre ton pseudo du jeu frero");

    if (password === "") setPasswordError("Pas de password, pas de chocolat");

    if (islandName === "") setIslandError("Rentre le nom de ton île frer");

    if (pseudo === "" || password === "" || islandName === "") return;
    resetErrors();
    setIsConnecting(true);

    try {
      const user = await signUpUser(pseudo, password, islandName);

      dispatch({ type: "SET_USER", user });
    } catch (err) {
      if (err.response) {
        if (err.response.data.error.message === "Pseudo already taken")
          setPseudoError("Ce pseudo est déjà utilisé ");
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const logIn = async () => {
    if (pseudo === "") setPseudoError("Rentre ton pseudo du jeu frero");

    if (password === "") setPasswordError("Pas de password, pas de chocolat");

    if (pseudo === "" || password === "") return;

    resetErrors();
    setIsConnecting(true);

    try {
      const user = await logInUser(pseudo, password);

      dispatch({ type: "SET_USER", user });
    } catch (err) {
      if (err.response) {
        if (err.response.data.error.message === "Wrong pseudo")
          setPseudoError("Ce pseudo n'existe pas");
        else if (err.response.data.error.message === "Wrong password")
          setPasswordError("Mauvais mot de passe");
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const resetErrors = () => {
    setPseudoError(null);
    setPasswordError(null);
    setIslandError(null);
  };

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
        <>
          Logged user
          <Button
            color="red"
            style={{ marginTop: "3rem" }}
            onClick={() => dispatch({ type: "LOG_OUT" })}
          >
            Déconnexion 👋
          </Button>
        </>
      )}
    </>
  );
};

export default Profile;
