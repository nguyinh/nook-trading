import React, { useEffect, useState, useContext } from "react";

import "./BuyingPrice.css";
import { Price } from "./";

const PriceAvatar = ({ src }) => (
  <div className="price--author-avatar--container">
    <img className="price--author-avatar" src={src} />
  </div>
);

const BuyingPrice = ({ prices, turnipsOwnedValue, turnipsOwned }) => {
  return (
    <div className="all-prices--container">
      {prices.map((trend) => (
        <div className="price--container">
          <PriceAvatar src={trend.author.avatar} />

          <div className="price--informations--container">
            <span className="nook-pseudo">{trend.author.pseudo}</span>

            <div className="price--informations--basis">
              <Price price={trend.sundayPrice} label="Prix dimanche matin" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BuyingPrice;
