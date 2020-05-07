import React, { useEffect, useState, useContext } from "react";

import { AppContext, TurnipContext } from "../../contexts";
import { BuyingPrices, TrendInput } from "./";

const DAY_CODES = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const byPriceAmount = (a, b) => (a.price < b.price ? 1 : -1);

const emptyPrices = (trend) => !!trend.price;

const WeekView = ({ onSelfTrendClick }) => {
  const {
    state: { currentUser },
  } = useContext(AppContext);

  const {
    state: { trends, selfTrend },
  } = useContext(TurnipContext);

  const [askForPrice, setAskForPrice] = useState(false);

  const now = new Date();
  const [day, setDay] = useState({
    name: DAY_CODES[now.getDay()],
    time: now.getHours() >= 12 ? "PM" : "AM",
  });

  useEffect(() => {
    if (!askForPrice) {
      const haveSelfCurrentPrice = !!selfTrend.prices[day.name][day.time];
      setAskForPrice(!haveSelfCurrentPrice);
    }
  }, [selfTrend]);

  return (
    <>
      {askForPrice && <TrendInput day={day} />}
      <BuyingPrices
        prices={trends
          .map(({ prices, _id, author }) => ({
            price: prices[day.name][day.time],
            _id,
            author,
          }))
          .sort(byPriceAmount)
          .filter(emptyPrices)}
        currentUserId={currentUser._id}
        turnipsOwnedValue={selfTrend && selfTrend.turnipsOwnedValue}
        turnipsOwned={selfTrend && selfTrend.turnipsOwned}
        onSelfTrendClick={onSelfTrendClick}
      />
    </>
  );
};

export default WeekView;
