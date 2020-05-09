import React, { useEffect, useState, useContext } from "react";

import { AppContext, TurnipContext } from "../../contexts";
import { SundayInput, SundayPrices, TurnipOwnedInput } from "./";
import { formatAvatarData } from "../../utils";

const bySundayPriceAmount = (a, b) => (a.sundayPrice < b.sundayPrice ? -1 : 1);

const emptySundayPrices = (trend) => !!trend.sundayPrice;

const SundayView = () => {
  const {
    state: { currentUser },
  } = useContext(AppContext);

  const {
    state: { trends, selfTrend },
  } = useContext(TurnipContext);

  const [askForPrice, setAskForPrice] = useState(false);
  const [askForTurnips, setAskForTurnips] = useState(false);

  useEffect(() => {
    if (!askForPrice) {
      setAskForPrice(selfTrend ? !selfTrend.sundayPrice : true);
    }
    if (!askForTurnips) {
      setAskForTurnips(
        selfTrend
          ? !selfTrend.turnipsOwned || !selfTrend.turnipsOwnedValue
          : true
      );
    }
  }, [selfTrend]);

  return (
    <>
      <div>
        {askForPrice && <SundayInput price={selfTrend.sundayPrice} />}

        {askForTurnips && (
          <TurnipOwnedInput
            turnipsOwned={selfTrend && selfTrend.turnipsOwned}
            turnipsOwnedValue={selfTrend && selfTrend.turnipsOwnedValue}
          />
        )}

        <SundayPrices
          prices={trends
            .map(({ sundayPrice, _id, author }) => ({
              sundayPrice,
              _id,
              author,
            }))
            .map(formatAvatarData)
            .sort(bySundayPriceAmount)
            .filter(emptySundayPrices)}
          currentUserId={currentUser._id}
        />
      </div>
    </>
  );
};

export default SundayView;
