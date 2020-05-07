import React, { useState } from "react";
import { Redirect } from "react-router-dom";

import { Price, PriceAvatar } from "./";

const SundayPrices = ({ prices, currentUserId, onSelfTrendClick }) => {
  const [redirectToDetailed, setRedirectToDetailed] = useState(null);
  const [redirectToProfile, setRedirectToProfile] = useState(null);
  const isSelfPrice = (trend) => currentUserId === trend.author._id;

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
            onClick={() =>
              isSelfPrice(trend)
                ? onSelfTrendClick()
                : setRedirectToDetailed(trend.author.pseudo)
            }
          >
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
