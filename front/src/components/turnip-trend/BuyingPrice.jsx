import React, { useEffect, useState, useContext } from "react";

import "./BuyingPrice.css";
import { ReactComponent as BellsPerTurnip } from "../../res/images/bells-per-turnip.svg";
import { ReactComponent as Bells } from "../../res/images/bells-flat.svg";
import { ReactComponent as TriangleUp } from "../../res/images/triangle-green.svg";
import { ReactComponent as TriangleDown } from "../../res/images/triangle-red.svg";

const PriceAvatar = ({ src }) => (
  <div className="price--author-avatar--container">
    <img className="price--author-avatar" src={src} />
  </div>
);

const Price = ({ price }) => (
  <div className="price-per-turnip--container">
    <div className="price-per-turnip">
      <span>{price}</span>

      <BellsPerTurnip />
      {/* <Bells/> */}
    </div>

    <span className="price-per-turnip--label">Prix rachat</span>
  </div>
);

const Profit = ({ price, turnipQuantity, turnipBoughtFor }) => {
  const totalProfit = price * turnipQuantity - turnipBoughtFor * turnipQuantity;
  let profitPercentage = (price - turnipBoughtFor) / turnipBoughtFor;
  profitPercentage = Math.floor(profitPercentage * 100);

  return (
    <div className="profit--container">
      <div className="profit">
        {!!turnipBoughtFor ? (
          <span>{`${totalProfit > 0 ? "+" : ""} ${totalProfit}`}</span>
        ) : (
          <span>{totalProfit}</span>
        )}

        <Bells className="bells-svg" />
      </div>

      <span className="profit--label">
        {!!turnipBoughtFor ? (
          <>
            {totalProfit > 0 ? "Bénéfice " : "Perte "}
            <span
              className={`profit--percentage ${
                totalProfit > 0 ? "positive" : "negative"
              }`}
            >
              {totalProfit > 0 ? (
                <TriangleUp className="profit--triangle-indicator" />
              ) : (
                <TriangleDown sclassName="profit--triangle-indicator" />
              )}{" "}
              {Math.abs(profitPercentage)}%
            </span>
          </>
        ) : (
          "Total"
        )}
      </span>
    </div>
  );
};

const BuyingPrice = ({ prices, turnipsOwnedValue, turnipsOwned }) => {
  return (
    <div className="all-prices--container">
      {prices.map((trend) => (
        <div className="price--container">
          <PriceAvatar src={trend.author.avatar} />

          <div className="price--informations--container">
            <span className="nook-pseudo">{trend.author.pseudo}</span>

            <div className="price--informations--basis">
              <Price price={trend.price} />

              {!!turnipsOwned && (
                <Profit
                  price={trend.price}
                  turnipQuantity={turnipsOwned}
                  turnipBoughtFor={turnipsOwnedValue}
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BuyingPrice;
