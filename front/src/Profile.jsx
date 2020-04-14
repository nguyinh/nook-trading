import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { AppContext } from "./AppContext";
// import { AuthContext } from "./AuthContext";
import { Button, Grid, Form, Header } from "semantic-ui-react";
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://172.20.10.4:2020";
// TODO: handle PROD env

const Profile = () => {
  const {
    state: { currentUser },
    dispatch,
  } = useContext(AppContext);

  const [isConnecting, setIsConnecting] = useState(false);
  const [signType, setSignType] = useState("SIGN_UP");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [islandName, setIslandName] = useState("");

  const signUp = async () => {
    try {
      setIsConnecting(true);

      const {
        data: { user },
      } = await axios.post("/api/auth/signin", {
        email,
        password,
        pseudo,
        islandName,
      });

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
      const {
        data: { user },
      } = await axios.post("/api/auth/login", {
        email,
        password,
      });

      dispatch({ type: "SET_USER", user });

      setIsConnecting(false);
    } catch (err) {
      console.log(err);
      setIsConnecting(false);
    }
  };

  return (
    <div className="profile-container">
      {currentUser ? (
        <>
          <Header as="h2">Hello {currentUser && currentUser.pseudo} 👋</Header>
          <Button color='red' onClick={() => dispatch({ type: "LOG_OUT" })}>Log out</Button>
        </>
      ) : (
        <>
          {signType === "SIGN_UP" ? (
            <Form loading={isConnecting}>
              <div className='profile-header'>
                <Header as="h2">Sign up</Header>
                <Button
                  content="Go to log in"
                  onClick={() => setSignType("LOG_IN")}
                />
              </div>

              <Form.Group>
                <Form.Input
                  label="Email"
                  className="profile-form-input"
                  width={12}
                  placeholder="Email"
                  name="email"
                  value={email}
                  type="email"
                  onChange={(_, { value }) => setEmail(value)}
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
                  label="Pseudo IG"
                  className="profile-form-input"
                  width={12}
                  placeholder="Pseudo"
                  name="pseudo"
                  value={pseudo}
                  onChange={(_, { value }) => setPseudo(value)}
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
                  content="Submit"
                  color="blue"
                  fluid
                  onClick={signUp}
                />
              </Form.Group>
            </Form>
          ) : (
            <Form loading={isConnecting}>
              
              <div className='profile-header'>
                <Header as="h2">Log in</Header>
                <Button
                content="Go to sign up"
                onClick={() => setSignType("SIGN_UP")}
              />
              </div>

              <Form.Group>
                <Form.Input
                  label="Email"
                  className="profile-form-input"
                  width={12}
                  placeholder="Email"
                  name="email"
                  value={email}
                  type="email"
                  onChange={(_, { value }) => setEmail(value)}
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
                  content="Submit"
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
