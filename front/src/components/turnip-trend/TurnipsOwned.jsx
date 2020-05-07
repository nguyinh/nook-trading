import React, { useState, useEffect } from "react";

import { spacify as s } from "../../utils";
import { ReactComponent as TriangleUp } from "../../res/images/triangle-green.svg";
import { ReactComponent as TriangleDown } from "../../res/images/triangle-red.svg";
import { ReactComponent as Bells } from "../../res/images/bells-flat.svg";

const TurnipSimulator = ({ quantity, value }) => {
  const [simulatedValue, setSimulatedValue] = useState(null);
  const totalProfit = !simulatedValue
    ? "-"
    : simulatedValue * quantity - value * quantity;
  let profitPercentage = (simulatedValue - value) / value;
  profitPercentage = Math.floor(profitPercentage * 100);

  if (!quantity) return null;

  return (
    <div className="turnip-owned--simulator">
      <div className="turnips-owned--input-row">
        <span className="turnip-owned--label-question--simulator">
          Si je vend mes navets a
        </span>

        <input
          className="turnip-owned--input"
          placeholder="..."
          defaultValue={simulatedValue}
          type="number"
          pattern="\d*"
          onChange={(e) => setSimulatedValue(e.target.value)}
        />
        <Bells className="bells-svg--simulator" />
      </div>

      <div className="turnips-owned--input-row--simulator">
        <span className="turnip-owned--label-question--simulator">
          j'aurais
        </span>

        <span className="turnip-owned--simulated-value">
          {!!value && simulatedValue ? (
            //  ? (
            <span>
              {`${totalProfit > 0 ? "+" : ""} ${s(totalProfit)}`}{" "}
              <Bells className="bells-svg--simulator" />
              <span
                className={`profit--percentage ${
                  totalProfit > 0 ? "positive" : "negative"
                }`}
              >
                {totalProfit > 0 ? (
                  <TriangleUp className="profit--triangle-indicator" />
                ) : (
                  <TriangleDown className="profit--triangle-indicator" />
                )}{" "}
                {Math.abs(profitPercentage)}%
              </span>
            </span>
          ) : (
            <>
              <span>{s(totalProfit)}</span>{" "}
              <Bells className="bells-svg--simulator" />
            </>
          )}
        </span>
      </div>
    </div>
  );
};

const TurnipsOwned = ({
  trend,
  defaultQuantity,
  handleChangedQuantity,
  defaultValue,
  handleChangedPrice,
  defaultSundayPrice,
  handleChangedSundayPrice,
}) => {
  const [quantity, setQuantity] = useState(defaultQuantity);
  const [timer1, setTimer1] = useState(null);

  const [value, setValue] = useState(defaultValue);
  const [timer2, setTimer2] = useState(null);

  const [sundayPrice, setSundayPrice] = useState(defaultSundayPrice);
  const [timer3, setTimer3] = useState(null);


  const handleTurnipsOwned = (value) => {
    setQuantity(value);
    if (timer1) clearTimeout(timer1);
    setTimer1(setTimeout(() => handleChangedQuantity(value || 0), 1000));
  };

  const handleTurnipsOwnedValue = (value) => {
    setValue(value);
    if (timer2) clearTimeout(timer2);
    setTimer2(setTimeout(() => handleChangedPrice(value || 0), 1000));
  };

  const handleSundayValue = (value) => {
    setSundayPrice(value);
    if (timer3) clearTimeout(timer3);
    setTimer3(setTimeout(() => handleChangedSundayPrice(value || 0), 1000));
  };

  useEffect(() => {
    setQuantity(defaultQuantity)
  }, [defaultQuantity]);
  
  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue]);
  
  useEffect(() => {
    setSundayPrice(defaultSundayPrice)
  }, [defaultSundayPrice]);

  return (
    <div className="turnips-owned--container">
      <div className="turnips-owned--questions-inputs">
        <div className="turnips-owned--input-row">
          <span className="turnip-owned--label-question">
            Ta quantite de navets
          </span>

          <input
            className="turnip-owned--input large"
            placeholder="..."
            value={quantity}
            type="number"
            pattern="\d*"
            onChange={(e) => handleTurnipsOwned(e.target.value)}
          />
        </div>

        <div className="turnips-owned--input-row">
          <span className="turnip-owned--label-question">
            Leur prix unitaire
          </span>

          <input
            className="turnip-owned--input"
            placeholder="..."
            value={value}
            type="number"
            pattern="\d*"
            onChange={(e) => handleTurnipsOwnedValue(e.target.value)}
          />
        </div>

        <div className="turnips-owned--input-row">
          <span className="turnip-owned--label-question">
            Prix de Porcelette sur ton ile
          </span>

          <input
            className="turnip-owned--input"
            placeholder="..."
            value={sundayPrice}
            type="number"
            pattern="\d*"
            onChange={(e) => handleSundayValue(e.target.value)}
          />
        </div>

        <TurnipSimulator
          quantity={trend.turnipsOwned}
          value={trend.turnipsOwnedValue}
        />
      </div>

      <span className="turnips-owned--label">Tes navets</span>
    </div>
  );
};

export default TurnipsOwned;
