import React, { useContext } from "react";
import { Loader } from "semantic-ui-react";
import { useParams } from "react-router-dom";

import { AppContext, TurnipProvider, TurnipContext } from "../contexts";
import { DetailedView, MainView } from "../components/turnip-trend";
import "./TurnipTrend.css";
import { WithLoader } from "../components/lib";

const OtherPlayerView = ({ pseudo, children }) => {
  const {
    state: { trends, isLoadingTrends },
  } = useContext(TurnipContext);

  return (
    <WithLoader active={isLoadingTrends} content="Attends frero">
      {trends && (
        <DetailedView
          trend={trends.find((trend) => trend.author.pseudo === pseudo)}
        />
      )}
    </WithLoader>
  );
};

const TurnipTrend = () => {
  const {
    state: { isAutoConnecting },
  } = useContext(AppContext);

  const { pseudo } = useParams();

  const isSunday = new Date().getDay() === 0;

  if (isAutoConnecting)
    return (
      <Loader active inline="centered" size="big" style={{ marginTop: "5rem" }}>
        Chargement de l'app{" "}
        <span role="img" aria-label="hold-emoji">
          ✋
        </span>
      </Loader>
    );

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
