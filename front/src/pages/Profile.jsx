import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../contexts";
import { signUpUser, logInUser } from "../services";
import { Button, Form, Header, Loader, Message } from "semantic-ui-react";
import nookTradingBanner from "../res/images/nook-trading-banner.png";
import "./Profile.css";

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

  return (<>
    <div className='profile-container-2'>
      <div className='login-form'>
        
      </div>

      <div className='app-presentation'>
        <div className='banner-container'>
          <img src={nookTradingBanner} id='atnh-banner'></img>
        </div>
      </div>
    </div>



    {false && <div className="profile-container">
      {currentUser ? (
        <>
          <img src={nookTradingBanner} style={{ width: "100%" }}></img>
          <Header as="h2">Hello {currentUser && currentUser.pseudo} 👋</Header>
          <Button color="red" style={{ marginTop: "3rem" }} onClick={() => dispatch({ type: "LOG_OUT" })}>
            Log out
          </Button>
        </>
      ) : (
        <>
          <img src={nookTradingBanner} style={{ width: "100%", marginBottom: "2rem" }}></img>
          {signType === "SIGN_UP" ? (
            <Form loading={isConnecting}>
              <div className="profile-header">
                <Header as="h2">Inscription</Header>
                <Button
                  content="Se connecter"
                  onClick={() => setSignType("LOG_IN")}
                />
              </div>

              <Form.Group>
                <Form.Input
                  label="Pseudo IG"
                  className="profile-form-input"
                  width={12}
                  placeholder="Pseudo"
                  name="pseudo"
                  value={pseudo}
                  error={pseudoError}
                  onFocus={resetErrors}
                  onChange={(_, { value }) => setPseudo(value)}
                />
                <Form.Input
                  label="Mot de passe"
                  className="profile-form-input"
                  width={12}
                  placeholder="Mot de passe"
                  name="password"
                  value={password}
                  error={passwordError}
                  onFocus={resetErrors}
                  type="password"
                  onChange={(_, { value }) => setPassword(value)}
                />
                <Form.Input
                  label="Nom de ton île"
                  className="profile-form-input"
                  width={12}
                  placeholder="Nom de ton île"
                  name="islandName"
                  value={islandName}
                  error={islandError}
                  onFocus={resetErrors}
                  onChange={(_, { value }) => setIslandName(value)}
                />
                <Button
                  width={12}
                  content="C'est tipar 🔥"
                  color="green"
                  fluid
                  onClick={signUp}
                />
              </Form.Group>
            </Form>
          ) : (
            <Form loading={isConnecting}>
              <div className="profile-header">
                <Header as="h2">Connection</Header>
                <Button
                  content="S'inscrire"
                  onClick={() => setSignType("SIGN_UP")}
                />
              </div>

              <Form.Group>
                <Form.Input
                  label="Pseudo IG"
                  className="profile-form-input"
                  width={12}
                  placeholder="Pseudo"
                  name="pseudo"
                  value={pseudo}
                  error={pseudoError}
                  onFocus={resetErrors}
                  onChange={(_, { value }) => setPseudo(value)}
                />
                <Form.Input
                  label="Password"
                  className="profile-form-input"
                  width={12}
                  placeholder="Password"
                  name="password"
                  value={password}
                  error={passwordError}
                  onFocus={resetErrors}
                  type="password"
                  onChange={(_, { value }) => setPassword(value)}
                />
                <Button
                  width={12}
                  content="Let's go"
                  color="green"
                  fluid
                  onClick={logIn}
                />
              </Form.Group>
            </Form>
          )}
        </>
      )}
    </div>}</>
  );
};

export default Profile;
