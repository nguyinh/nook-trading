import React, { useContext } from "react";

import { AppContext, TurnipContext } from "../../contexts";
import { WeekGraph } from "./";

const WeekGraphsView = () => {
  const {
    state: { currentUser },
  } = useContext(AppContext);

  const {
    state: { trends },
  } = useContext(TurnipContext);

  return (
    <>
      {trends &&
        trends.map(({ author, prices }) => (
          <WeekGraph
            trend={{ author, prices }}
            withPseudo
            currentUserId={currentUser._id}
          />
        ))}
    </>
  );
};

export default WeekGraphsView;
