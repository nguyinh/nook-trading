import React from "react";

import { Price, PriceAvatar } from "./";

const SundayPrices = ({ prices, turnipsOwnedValue, turnipsOwned }) => {
  return (
    <div className="all-prices--container">
      {prices.map((trend) => (
        <div className="price--container" key={trend._id}>
          <PriceAvatar src={trend.author.avatar} />

          <div className="price--informations--container">
            <span className="nook-pseudo">{trend.author.pseudo}</span>

            <div className="price--informations--basis">
              <Price price={trend.sundayPrice} label="Prix du dimanche matin" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SundayPrices;
