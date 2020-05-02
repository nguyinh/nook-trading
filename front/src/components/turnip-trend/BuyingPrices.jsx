import React, { useState } from "react";
import { Redirect } from "react-router-dom";

import { Price, PriceAvatar } from ".";
import { ReactComponent as Bells } from "../../res/images/bells-flat.svg";
import { ReactComponent as TriangleUp } from "../../res/images/triangle-green.svg";
import { ReactComponent as TriangleDown } from "../../res/images/triangle-red.svg";
import { spacify as s } from "../../utils";

const Profit = ({ price, turnipQuantity, turnipBoughtFor }) => {
  const totalProfit = price * turnipQuantity - turnipBoughtFor * turnipQuantity;
  let profitPercentage = (price - turnipBoughtFor) / turnipBoughtFor;
  profitPercentage = Math.floor(profitPercentage * 100);

  return (
    <div className="profit--container">
      <div className="profit">
        {!!turnipBoughtFor ? (
          <span>{`${totalProfit > 0 ? "+" : ""} ${s(totalProfit)}`}</span>
        ) : (
          <span>{s(totalProfit)}</span>
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
                <TriangleDown className="profit--triangle-indicator" />
              )}{" "}
              {Math.abs(profitPercentage)}%
            </span>
          </>
        ) : (
          "Prix de vente"
        )}
      </span>
    </div>
  );
};

const BuyingPrices = ({ prices, turnipsOwnedValue, turnipsOwned }) => {
  const [redirectToDetailed, setRedirectToDetailed] = useState(null);
  const [redirectToProfile, setRedirectToProfile] = useState(null);

  if (redirectToDetailed)
    return <Redirect to={`/turnip-trend/${redirectToDetailed}`} push />;
  if (redirectToProfile)
    return <Redirect to={`/profile/${redirectToProfile}`} push />;

  return (
    <div className="all-prices--container">
      {prices.map((trend) => (
        <div className="price--container" key={trend._id}>
          <PriceAvatar
            src={trend.author.avatar}
            onClick={() => setRedirectToProfile(trend.author.pseudo)}
          />

          <div
            className="price--informations--container"
            onClick={() => setRedirectToDetailed(trend.author.pseudo)}
          >
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

export default BuyingPrices;
