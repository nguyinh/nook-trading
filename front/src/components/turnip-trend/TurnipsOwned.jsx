import React, { useState } from "react";

const TurnipsOwned = ({ trend, handleChangedQuantity, handleChangedPrice, handleChangedSundayPrice }) => {
  const [timer, setTimer] = useState(null);
  const [valueTimer, setValueTimer] = useState(null);

  const handleTurnipsOwned = (value) => {
    if (timer) clearTimeout(timer);
    setTimer(setTimeout(() => handleChangedQuantity(value || 0), 1000));
  };

  const handleTurnipsOwnedValue = (value) => {
    if (valueTimer) clearTimeout(valueTimer);
    setValueTimer(setTimeout(() => handleChangedPrice(value || 0), 1000));
  };

  return (
    <div className="turnips-owned--container">
      <div className="turnips-owned--questions-inputs">
        <div className="turnips-owned--input-row">
          <span className="turnip-owned--label-question">Ta quantite de navets</span>

          <input
            className="turnip-owned--input large"
            placeholder="..."
            defaultValue={trend.turnipsOwned}
            type="number"
            pattern="\d*"
            onChange={(e) => handleTurnipsOwned(e.target.value)}
          />
        </div>

        <div className="turnips-owned--input-row">
          <span className="turnip-owned--label-question">Leur prix unitaire</span>

          <input
            className="turnip-owned--input"
            placeholder="..."
            defaultValue={trend.turnipsOwnedValue}
            type="number"
            pattern="\d*"
            onChange={(e) => handleTurnipsOwnedValue(e.target.value)}
          />
        </div>

        <div className="turnips-owned--input-row">
          <span className="turnip-owned--label-question">Prix de Porcelette sur ton ile</span>

          <input
            className="turnip-owned--input"
            placeholder="..."
            defaultValue={trend.sundayPrice}
            type="number"
            pattern="\d*"
            onChange={(e) => handleChangedSundayPrice(e.target.value)}
          />
        </div>
      </div>

      <span className="turnips-owned--label">Tes navets</span>
    </div>
  );
};

export default TurnipsOwned;
