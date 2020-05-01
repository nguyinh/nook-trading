import React from "react";

const DAYS = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];

const DayEntry = ({ price }) => {
  return (
    <div className="day-entry--container">
      <span className="day-entry--label">{price.label}</span>
      <div className="day-entry--moment--container">
        <div className="day-entry--moment">
          <span className="day-entry--moment--label">AM</span>
          <span className="day-entry--moment--input">78</span>
        </div>

        <div className="day-entry--moment">
          <span className="day-entry--moment--label">PM</span>
          <span className="day-entry--moment--input">98</span>
        </div>
      </div>
    </div>
  );
};

const WeekPrices = ({ trend }) => {
  let prices = Object.values(trend.prices);
  prices = prices.map((price, i) => ({ ...price, label: DAYS[i + 1] }));
  console.log(prices);
  return (
    <div className="week-prices--container">
      <div className="week-prices--prices">
        {prices.map((price) => (
          <DayEntry price={price} />
        ))}
      </div>

      <span className="week-prices--label">Semaine du </span>
    </div>
  );
};

export default WeekPrices;
