import React, { useContext } from "react";

import { TurnipContext } from "../../contexts";
import { WeekGraph } from './';

const WeekGraphsView = () => {
  const {
    state: { trends },
  } = useContext(TurnipContext);


  return <>
  {
    trends && (
      trends.map(({author, prices}) => <WeekGraph trend={{author, prices}} withPseudo/>)
    )
  }
  </>;
};

export default WeekGraphsView;
