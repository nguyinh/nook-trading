import React, { useState, useContext, useEffect } from "react";
import { Loader, Icon } from "semantic-ui-react";
import { useParams, Redirect } from "react-router-dom";

import { AppContext, TurnipProvider, TurnipContext } from "../contexts";
import { DetailedView, MainView } from "../components/turnip-trend";
import "./TurnipTrend.css";
import { WithLoader } from "../components/lib";

const NotFoundUser = ({ pseudo, allowBackTo }) => {
  const [backToDetailed, setBackToDetailed] = useState(null);

  if (backToDetailed) return <Redirect to={"/turnip-trend"} push />;

  return (
    <div className="detailled-view--container">
      {allowBackTo && (
        <div className="back-button" onClick={() => setBackToDetailed(true)}>
          <Icon name="angle left" size="big" />
        </div>
      )}

      <div className='no-data' style={{marginTop: '10rem'}}>Nous ne connaissons pas de {pseudo}</div>
    </div>
  );
};

const OtherPlayerView = ({ pseudo }) => {
  const {
    state: { trends, isLoadingTrends },
  } = useContext(TurnipContext);

  const [userTrend, setUserTrend] = useState(null);
  useEffect(() => {
    if (trends)
      setUserTrend(trends.find((trend) => trend.author.pseudo === pseudo));
  }, [trends]);

  return (
    <WithLoader active={isLoadingTrends} content="Nous demandons à Marie 🐩">
      {userTrend ? (
        <DetailedView trend={userTrend} />
      ) : (
        <NotFoundUser pseudo={pseudo} allowBackTo />
      )}
    </WithLoader>
  );
};

const TurnipTrend = () => {
  const {
    state: { currentUser, isAutoConnecting },
  } = useContext(AppContext);

  const { pseudo } = useParams();

  if (isAutoConnecting)
    return (
      <Loader active inline="centered" size="big" style={{ marginTop: "5rem" }}>
        Chargement de l'app{" "}
        <span role="img" aria-label="hold-emoji">
          ✋
        </span>
      </Loader>
    );

  if (!currentUser) return <Redirect to={"/profile"} push />;

  return (
    <>
      <TurnipProvider>
        {pseudo ? (
          <OtherPlayerView pseudo={pseudo} />
        ) : (
          <MainView pseudo={pseudo} />
        )}
      </TurnipProvider>
    </>
  );
  // TODO: if no user do something
};

export default TurnipTrend;
