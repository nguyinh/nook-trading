import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../../contexts";
import { signUpUser, logInUser } from "../../services";
import { Button, Dimmer, Header, Loader, Input } from "semantic-ui-react";
import { ReactComponent as NextButton } from "../../res/images/arrow-button-next.svg";

const SignUp = ({
  setSignType,
  usePseudo,
  usePassword,
  usePasswordConfirmation,
  pseudoError,
  passwordError,
  passwordConfirmationError,
  resetErrors,
  error,
  signUp,
}) => {
  const [pseudo, setPseudo] = usePseudo;
  const [password, setPassword] = usePassword;
  const [
    passwordConfirmation,
    setPasswordConfirmation,
  ] = usePasswordConfirmation;

  return (
    <>
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

      <NextButton className="next-button" onClick={signUp} />

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

const ProfileContent = () => {
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
  const [islandName, setIslandName] = useState("");
  const [islandError, setIslandError] = useState(null);

  const handleSignUp = async () => {
    console.log("test");
    if (pseudo === "") setPseudoError("Rentre ton pseudo du jeu frero");

    if (password === "") setPasswordError("Pas de password, pas de chocolat");

    if (passwordConfirmation === "")
      setPasswordConfirmationError("Il manque la confirmation");

    if (password !== passwordConfirmation)
      setPasswordConfirmationError("Les mots de passe ne sont pas identiques");

    // if (islandName === "") setIslandError("Rentre le nom de ton île frer");

    if (
      pseudo === "" ||
      password === "" ||
      passwordConfirmation === "" ||
      password !== passwordConfirmation /* || islandName === ""*/
    )
      return;
    resetErrors();
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
    <div className="profile-content-container">
      <Dimmer inverted active={isConnecting}>
        <Loader></Loader>
      </Dimmer>
      {currentUser ? (
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
      ) : (
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
              pseudoError={pseudoError}
              passwordError={passwordError}
              passwordConfirmationError={passwordConfirmationError}
              resetErrors={resetErrors}
              error={error}
              signUp={handleSignUp}
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
      )}
    </div>
  );
};

export default ProfileContent;