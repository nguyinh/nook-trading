import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../contexts";
import { signUpUser, logInUser } from "../services";
import { Button, Form, Header, Loader } from "semantic-ui-react";
import ATNH from '../res/images/animal-trading-banner.png';

const Profile = () => {
  const {
    state: { currentUser, isAutoConnecting },
    dispatch,
  } = useContext(AppContext);

  const [isConnecting, setIsConnecting] = useState(false);
  const [signType, setSignType] = useState("SIGN_UP");
  const [password, setPassword] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [islandName, setIslandName] = useState("");

  const signUp = async () => {
    try {
      setIsConnecting(true);

      const user = await signUpUser(pseudo, password, islandName);

      dispatch({ type: "SET_USER", user });

      setIsConnecting(false);
    } catch (err) {
      console.log(err);
      setIsConnecting(false);
    }
  };

  const logIn = async () => {
    setIsConnecting(true);

    try {
      const user = await logInUser(pseudo, password);

      dispatch({ type: "SET_USER", user });

      setIsConnecting(false);
    } catch (err) {
      console.log(err);
      setIsConnecting(false);
    }
  };

  if (isAutoConnecting)
    return (
      <Loader active inline="centered" size="big" style={{ marginTop: "5rem" }}>
        Chargement de l'app ✋
      </Loader>
    );

  return (
    <div className="profile-container">
      {currentUser ? (
        <>
          <Header as="h2">Hello {currentUser && currentUser.pseudo} 👋</Header>
          <Button color="red" onClick={() => dispatch({ type: "LOG_OUT" })}>
            Log out
          </Button>
        </>
      ) : (
        <>
          <img src={ATNH} style={{width: '100%', marginBottom: '2rem'}}></img>
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
                  onChange={(_, { value }) => setPseudo(value)}
                />
                <Form.Input
                  label="Password"
                  className="profile-form-input"
                  width={12}
                  placeholder="Password"
                  name="password"
                  value={password}
                  type="password"
                  onChange={(_, { value }) => setPassword(value)}
                />
                <Form.Input
                  label="Island name"
                  className="profile-form-input"
                  width={12}
                  placeholder="Island name"
                  name="islandName"
                  value={islandName}
                  onChange={(_, { value }) => setIslandName(value)}
                />
                <Button
                  width={12}
                  content="C'est tipar 🔥"
                  color="blue"
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
                  onChange={(_, { value }) => setPseudo(value)}
                />
                <Form.Input
                  label="Password"
                  className="profile-form-input"
                  width={12}
                  placeholder="Password"
                  name="password"
                  value={password}
                  type="password"
                  onChange={(_, { value }) => setPassword(value)}
                />
                <Button
                  width={12}
                  content="Let's go"
                  color="blue"
                  fluid
                  onClick={logIn}
                />
              </Form.Group>
            </Form>
          )}
        </>
      )}
    </div>
  );
};

export default Profile;
