import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../../contexts";
import { signUpUser, logInUser } from "../../services";
import { Button, Dimmer, Header, Loader, Input } from "semantic-ui-react";
import { CSSTransition } from "react-transition-group";

import { ReactComponent as NextButton } from "../../res/images/arrow-button-next.svg";
import { ReactComponent as CheckButton } from "../../res/images/check-button.svg";

import { ReactComponent as AppleButton } from "../../res/images/apple-button.svg";
import { ReactComponent as OrangeButton } from "../../res/images/orange-button.svg";
import { ReactComponent as CherryButton } from "../../res/images/cherry-button.svg";
import { ReactComponent as PeachButton } from "../../res/images/peach-button.svg";
import { ReactComponent as PearButton } from "../../res/images/pear-button.svg";

const SignUp = ({
  setSignType,
  usePseudo,
  usePassword,
  usePasswordConfirmation,
  isAskingComplementary,
  useIslandName,
  useHemisphere,
  useNativeFruit,
  useFriendCode,
  pseudoError,
  passwordError,
  passwordConfirmationError,
  resetErrors,
  error,
  signUp,
  goToComplementary,
}) => {
  const [pseudo, setPseudo] = usePseudo;
  const [password, setPassword] = usePassword;
  const [
    passwordConfirmation,
    setPasswordConfirmation,
  ] = usePasswordConfirmation;

  const [islandName, setIslandName] = useIslandName;
  const [friendCode, setFriendCode] = useFriendCode;
  const [hemisphere, setHemisphere] = useHemisphere;
  const [nativeFruit, setNativefruit] = useNativeFruit;
console.log(pseudoError,
  passwordError,
  passwordConfirmationError)
  return (
    <>
      <div className="sign-up-root-container">
        <CSSTransition
          in={!isAskingComplementary}
          // unmountOnExit
          timeout={300}
          classNames="sign-up-anim"
        >
          <div className="sign-up-container">
            <Header as="h2">Inscription</Header>

            <Input
              className="profile-form-input nook-input"
              width={12}
              placeholder="Pseudo"
              name="pseudo"
              value={pseudo}
              error={!!pseudoError}
              onFocus={resetErrors}
              onChange={(_, { value }) => setPseudo(value)}
            />

            <Input
              className="profile-form-input nook-input"
              width={12}
              placeholder="Mot de passe"
              name="password"
              value={password}
              error={!!passwordError}
              onFocus={resetErrors}
              type="password"
              onChange={(_, { value }) => setPassword(value)}
            />

            <Input
              className="profile-form-input nook-input"
              width={12}
              placeholder="Mot de passe (confirmation)"
              name="password"
              value={passwordConfirmation}
              error={!!passwordConfirmationError}
              onFocus={resetErrors}
              type="password"
              onChange={(_, { value }) => setPasswordConfirmation(value)}
            />

            {error && <span className="error-message">{error}</span>}

            <NextButton
              className="next-button"
              onClick={goToComplementary}
            />

            <div>
              <span>Déjà un compte ?</span>
              <a
                onClick={() => {
                  resetErrors();
                  setSignType("LOG_IN");
                }}
              >
                &nbsp;Connexion
              </a>
            </div>
          </div>
        </CSSTransition>

        <CSSTransition
          in={isAskingComplementary}
          unmountOnExit
          timeout={300}
          classNames="sign-up-complementary-anim"
        >
          <div className="sign-up-complementary-absolute">
            <div className="sign-up-complementary-container">
              <Header as="h2">...hop hop pas si vite</Header>

              <span className="nook-input-label">Nom de ton île</span>
              <Input
                className="profile-form-input nook-input"
                width={12}
                placeholder="Île des pirates"
                name="island"
                value={islandName}
                onChange={(_, { value }) => setIslandName(value)}
              />

              <span className="nook-input-label">Hémisphère</span>
              <div className="hemisphere-buttons">
                <button
                  style={
                    hemisphere === "NORTH"
                      ? { border: "solid 3px #E2AE65", opacity: 1 }
                      : null
                  }
                  onClick={() => setHemisphere("NORTH")}
                >
                  Nord
                </button>
                <button
                  style={
                    hemisphere === "SOUTH"
                      ? { border: "solid 3px #E2AE65", opacity: 1 }
                      : null
                  }
                  onClick={() => setHemisphere("SOUTH")}
                >
                  Sud
                </button>
              </div>

              <span className="nook-input-label">Fruit natif de ton île</span>
              <div className="fruits-buttons">
                <CherryButton
                  className={`${
                    nativeFruit === "CHERRY" ? "active-fruit" : ""
                  }`}
                  onClick={() => setNativefruit("CHERRY")}
                />
                <AppleButton
                  className={`${nativeFruit === "APPLE" ? "active-fruit" : ""}`}
                  onClick={() => setNativefruit("APPLE")}
                />
                <OrangeButton
                  className={`${
                    nativeFruit === "ORANGE" ? "active-fruit" : ""
                  }`}
                  onClick={() => setNativefruit("ORANGE")}
                />
                <PeachButton
                  className={`${nativeFruit === "PEACH" ? "active-fruit" : ""}`}
                  onClick={() => setNativefruit("PEACH")}
                />
                <PearButton
                  className={`${nativeFruit === "PEAR" ? "active-fruit" : ""}`}
                  onClick={() => setNativefruit("PEAR")}
                />
              </div>

              <span className="nook-input-label">Code ami Switch</span>
              <Input
                className="profile-form-input nook-input"
                width={12}
                placeholder="SW-XXXX-XXXX-XXXX"
                name="friendCode"
                value={friendCode}
                // error={!!passwordConfirmationError}
                onFocus={resetErrors}
                onChange={(_, { value }) => setFriendCode(value)}
              />

              {error && <span className="error-message">{error}</span>}

              <CheckButton className="next-button" onClick={signUp} />

              {/* <div>
                <span>Déjà un compte ?</span>
                <a
                  onClick={() => {
                    resetErrors();
                    setSignType("LOG_IN");
                  }}
                >
                  &nbsp;Connexion
                </a>
              </div> */}
            </div>
          </div>
        </CSSTransition>
      </div>
    </>
  );
};

const LogIn = ({
  setSignType,
  usePseudo,
  usePassword,
  pseudoError,
  passwordError,
  resetErrors,
  error,
  logIn,
}) => {
  const [pseudo, setPseudo] = usePseudo;
  const [password, setPassword] = usePassword;

  return (
    <>
      <Header as="h2">Connexion</Header>

      <Input
        className="profile-form-input nook-input"
        width={12}
        placeholder="Pseudo"
        name="pseudo"
        value={pseudo}
        error={pseudoError}
        onFocus={resetErrors}
        onChange={(_, { value }) => setPseudo(value)}
      />

      <Input
        className="profile-form-input nook-input"
        width={12}
        placeholder="Mot de passe"
        name="password"
        value={password}
        error={passwordError}
        onFocus={resetErrors}
        type="password"
        onChange={(_, { value }) => setPassword(value)}
      />

      {error && <span className="error-message">{error}</span>}

      <NextButton className="next-button" onClick={logIn} />

      <div>
        <span>Pas de compte ?</span>
        <a
          onClick={() => {
            resetErrors();
            setSignType("SIGN_UP");
          }}
        >
          &nbsp;Inscription
        </a>
      </div>
    </>
  );
};

const Authentification = () => {
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
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [passwordConfirmationError, setPasswordConfirmationError] = useState(
    null
  );
  const [error, setError] = useState(null);

  const [isAskingComplementary, setIsAskingComplementary] = useState(false);
  const [hemisphere, setHemisphere] = useState(null);
  const [nativeFruit, setNativefruit] = useState(null);
  const [islandName, setIslandName] = useState("");
  const [islandError, setIslandError] = useState(null);
  const [friendCode, setFriendCode] = useState(null);

  const goToComplementary = () => {
    if (pseudo === "") setPseudoError("Rentre ton pseudo du jeu frero");

    if (password === "") setPasswordError("Pas de password, pas de chocolat");

    if (passwordConfirmation === "")
      setPasswordConfirmationError("Il manque la confirmation");

    if (password !== passwordConfirmation)
      setPasswordConfirmationError("Les mots de passe ne sont pas identiques");

    if (
      pseudo === "" ||
      password === "" ||
      passwordConfirmation === "" ||
      password !== passwordConfirmation /* || islandName === ""*/
    )
      return;

    resetErrors();
    setIsAskingComplementary(true);
  };

  const handleSignUp = async () => {
    // if (islandName === "") setIslandError("Rentre le nom de ton île frer");
    console.log(
      pseudo,
      password,
      hemisphere,
      nativeFruit,
      islandName,
      friendCode);
      return;
    setIsConnecting(true);

    try {
      const user = await signUpUser(pseudo, password, islandName);

      dispatch({ type: "SET_USER", user });
    } catch (err) {
      if (err.response) {
        console.log(err.response.data.error.message);
        if (err.response.data.error.message === "Pseudo already taken")
          setError("Ce pseudo est déjà utilisé");
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleLogIn = async () => {
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
          setError("Ce pseudo n'existe pas");
        else if (err.response.data.error.message === "Wrong password")
          setError("Mauvais mot de passe");
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const resetErrors = () => {
    setError(null);
    setPseudoError(null);
    setPasswordError(null);
    setPasswordConfirmationError(null);
    setIslandError(null);
  };

  if (isAutoConnecting)
    return (
      <Loader active inline="centered" size="big" style={{ marginTop: "5rem" }}>
        Chargement de l'app ✋
      </Loader>
    );

  return (
    <div className="login-form-container">
      <div className="profile-content-container">
        <Dimmer inverted active={isConnecting}>
          <Loader></Loader>
        </Dimmer>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "space-evenly",
          }}
        >
          {signType === "SIGN_UP" ? (
            <SignUp
              setSignType={setSignType}
              usePseudo={[pseudo, setPseudo]}
              usePassword={[password, setPassword]}
              usePasswordConfirmation={[
                passwordConfirmation,
                setPasswordConfirmation,
              ]}
              isAskingComplementary={isAskingComplementary}
              useIslandName={[islandName, setIslandName]}
              useHemisphere={[hemisphere, setHemisphere]}
              useNativeFruit={[nativeFruit, setNativefruit]}
              useFriendCode={[friendCode, setFriendCode]}
              pseudoError={pseudoError}
              passwordError={passwordError}
              passwordConfirmationError={passwordConfirmationError}
              resetErrors={resetErrors}
              error={error}
              signUp={handleSignUp}
              goToComplementary={goToComplementary}
            />
          ) : (
            <LogIn
              setSignType={setSignType}
              usePseudo={[pseudo, setPseudo]}
              usePassword={[password, setPassword]}
              pseudoError={pseudoError}
              passwordError={passwordError}
              resetErrors={resetErrors}
              error={error}
              logIn={handleLogIn}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Authentification;
