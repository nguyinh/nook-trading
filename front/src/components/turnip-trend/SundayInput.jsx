import React, { useState } from "react";
import { Loader } from "semantic-ui-react";

import { setSundayPrice } from "../../services";
import { ReactComponent as BellsPerTurnip } from "../../res/images/bells-per-turnip-2.svg";
import { ReactComponent as Check } from "../../res/images/little-check.svg";
import { getLastSunday } from '../../utils';

const SundayInput = ({ updateTrends }) => {
  const [isSavingPrice, setIsSavingPrice] = useState(false);
  const [isDefaultLabel, setIsDefaultLabel] = useState(true);
  const [timer, setTimer] = useState(null);

  const handleChangedPrice = (value) => {
    const saveSundayPrice = async (newPrice) => {
      try {
        setIsSavingPrice(true);

        // FIXME: In theory today is Sunday

        const trend = await setSundayPrice(
          getLastSunday(),
          newPrice
        );
        setIsDefaultLabel(false);

        updateTrends(trend);
      } catch (err) {
        console.log(err);
      } finally {
        setIsSavingPrice(false);
      }
    };

    if (timer) clearTimeout(timer);
    if (value) {
      setTimer(setTimeout(() => saveSundayPrice(value), 1000));
    }
  };

  return (
    <div className="turnip-input--container">
      <span>{`A quel prix Porcelette vend-t-elle ses navets sur ton île ?`}</span>

      <div className="turnip-input">
        <BellsPerTurnip />
        <input
          type="number"
          pattern="\d*"
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

export default SundayInput;
