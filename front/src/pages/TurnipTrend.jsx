import React, { useEffect, useState, useContext } from "react";
import { Loader } from "semantic-ui-react";
import { useParams } from "react-router-dom";

import "./TurnipTrend.css";
import { AppContext } from "../contexts";
import { WeekView, SundayView } from "../components/turnip-trend";

const TurnipTrend = () => {
  const {
    state: { currentUser, isAutoConnecting },
  } = useContext(AppContext);

  const isSunday = new Date().getDay() === 0;

  if (isAutoConnecting)
    return (
      <Loader active inline="centered" size="big" style={{ marginTop: "5rem" }}>
        Chargement de l'app ✋
      </Loader>
    );

  return <div>{true || isSunday ? <SundayView /> : <WeekView />}</div>;
};

export default TurnipTrend;
