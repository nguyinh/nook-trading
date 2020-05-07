import React, { useState, useContext } from "react";
import { Loader } from "semantic-ui-react";

import { TurnipContext } from "../../contexts";
import { addCurrentPrice } from "../../services";
import { getLastSunday } from "../../utils";
import { ReactComponent as BellsPerTurnip } from "../../res/images/bells-per-turnip-2.svg";
import { ReactComponent as Check } from "../../res/images/little-check.svg";

const DAYS = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];

const TrendInput = ({ updatePrices, day }) => {
  const {
    state: { selfTrend },
    dispatch,
  } = useContext(TurnipContext);

  const [isSavingPrice, setIsSavingPrice] = useState(false);
  const [isDefaultLabel, setIsDefaultLabel] = useState(true);
  const [timer, setTimer] = useState(null);
  const [isMorning] = useState(new Date().getHours() < 12);

  const handleChangedPrice = (value) => {
    const savePrice = async (newPrice) => {
      try {
        setIsSavingPrice(true);
        const now = new Date();

        const trend = await addCurrentPrice(
          now.getDay(),
          now.getHours(),
          getLastSunday(),
          newPrice
        );
        setIsDefaultLabel(false);
        
        dispatch({ type: "UPDATE_TREND", trend });
      } catch (err) {
        console.log(err);
      } finally {
        setIsSavingPrice(false);
      }
    };

    if (timer) clearTimeout(timer);
    if (value) {
      setTimer(setTimeout(() => savePrice(value), 1000));
    }
  };

  return (
    <div className="turnip-input--container">
      <span>{`Quel est ton cours du navet ce ${DAYS[new Date().getDay()]} ${
        isMorning ? "matin" : "apres-midi"
      } ?`}</span>

      <div className="turnip-input">
        <BellsPerTurnip />
        <input
          type="number"
          pattern="\d*"
          id="price-input"
          name="price-input"
          defaultValue={selfTrend.prices[day.name][day.time]}
          onChange={(e) => handleChangedPrice(e.target.value)}
        />
        <span className="turnip-input--label">
          {isSavingPrice ? (
            <Loader active inline size="mini" />
          ) : isDefaultLabel ? (
            "prix"
          ) : (
            <Check style={{ marginBottom: "-2px" }} />
          )}
        </span>
      </div>
    </div>
  );
};

export default TrendInput;
