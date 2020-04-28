import React, { useState } from "react";
import { Loader } from "semantic-ui-react";

import { addCurrentPrice } from "../../services";
import { ReactComponent as BellsPerTurnip } from "../../res/images/bells-per-turnip-2.svg";
import { ReactComponent as Check } from "../../res/images/little-check.svg";

const TrendInput = ({ updatePrices }) => {
  const [isSavingPrice, setIsSavingPrice] = useState(false);
  const [isDefaultLabel, setIsDefaultLabel] = useState(true);
  const [timer, setTimer] = useState(null);
  const [isMorning] = useState(new Date().getHours() < 12);

  const handleChangedPrice = (value) => {
    const savePrice = async (newPrice) => {
      try {
        setIsSavingPrice(true);
        const now = new Date();
        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );
        const lastSunday = new Date(
          today.setDate(today.getDate() - today.getDay())
        );

        const price = await addCurrentPrice(
          now.getDay(),
          now.getHours(),
          lastSunday,
          newPrice
        );
        setIsDefaultLabel(false);

        updatePrices(price);
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
      <span>{`Quel est ton cours du navet ${
        isMorning ? "ce matin" : "cet apres-midi"
      } ?`}</span>

      <div className="turnip-input">
        <BellsPerTurnip />
        <input
          type="text"
          id="price-input"
          name="price-input"
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
