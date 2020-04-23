import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../contexts";
import { getUser } from "../services";
import { Button, Loader } from "semantic-ui-react";
import nookTradingBanner from "../res/images/nook-trading-banner.png";
import "./Profile.css";
import { Authentification, UserProfile } from "../components/profile";

const Profile = () => {
  const {
    state: { currentUser, isAutoConnecting },
    dispatch,
  } = useContext(AppContext);

  const { pseudo } = useParams();

  const [isFetchingUser, setIsFetchingUser] = useState(!!pseudo);
  const [userData, setUserData] = useState(null);

  const fetchUserProfile = async (pseudo) => {
    try {
      const user = await getUser(pseudo);

      setIsFetchingUser(true);
      await setUserData(user);
    } catch (err) {
      setUserData(undefined);
      console.log(err);
    } finally {
      setIsFetchingUser(false);
    }
  };

  useEffect(() => {
    if (pseudo) fetchUserProfile(pseudo);
  }, [pseudo]);

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
        <div className="logged-profile-container">
          {!isFetchingUser ? (
            <>
              {userData === undefined ? (
                <div className="no-data" style={{ fontSize: "1.1rem" }}>
                  J'ai pas trouvé ton pote{" "}
                  <span style={{ fontWeight: 800 }}>{pseudo}</span> 🙅‍♂️
                </div>
              ) : (
                <>
                  <UserProfile userData={userData} />

                  {!userData && (
                    <Button
                      color="red"
                      style={{ marginTop: "3rem" }}
                      onClick={() => dispatch({ type: "LOG_OUT" })}
                    >
                      Déconnexion 👋
                    </Button>
                  )}
                </>
              )}
            </>
          ) : (
            <Loader
              active
              content="Un instant, je recheche ton frero 🖐"
              style={{ marginTop: "30%" }}
            />
          )}
        </div>
      )}
    </>
  );
};

export default Profile;
