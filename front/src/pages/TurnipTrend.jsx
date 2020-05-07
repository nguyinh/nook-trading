import React, { useContext } from "react";
import { Loader } from "semantic-ui-react";
import { useParams } from "react-router-dom";

import { AppContext, TurnipProvider } from "../contexts";
import {
  DetailedView,
  MainView,
} from "../components/turnip-trend";
import "./TurnipTrend.css";

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
        {pseudo ? <DetailedView pseudo={pseudo} /> : <MainView pseudo={pseudo} />}
      </TurnipProvider>
    </>
  );
  // TODO: if no user do something
};

export default TurnipTrend;
