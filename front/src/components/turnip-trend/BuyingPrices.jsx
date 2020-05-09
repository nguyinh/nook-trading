import React, { useState, useContext } from "react";
import { Redirect } from "react-router-dom";

import { Price, PriceAvatar } from ".";
import { TurnipContext } from "../../contexts";
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

const BuyingPrices = ({
  prices,
  currentUserId,
  turnipsOwnedValue,
  turnipsOwned,
}) => {
  const { dispatch } = useContext(TurnipContext);

  const [redirectToDetailed, setRedirectToDetailed] = useState(null);
  const isSelfPrice = (trend) => currentUserId === trend.author._id;

  if (redirectToDetailed)
    return <Redirect to={`/turnip-trend/${redirectToDetailed}`} push />;

  return (
    <div className="all-prices--container">
      {prices.length ? (
        prices.map((trend) => (
          <div
            className="price--container"
            key={trend._id}
            onClick={() =>
              isSelfPrice(trend)
                ? dispatch({ type: "GO_TO_PAGE", page: 2 })
                : setRedirectToDetailed(trend.author.pseudo)
            }
          >
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
        ))
      ) : (
        <div className="no-data">
          Personne n'a publié son cours pour le moment
        </div>
      )}
    </div>
  );
};

export default BuyingPrices;
