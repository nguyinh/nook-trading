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

const DayEntryInput = ({ value, isPast, isFuture, AM, PM }) => {
  const isCurrentDayMoment = new Date().getHours() < 12 ? AM : PM;
  const isToday = !isPast && !isFuture;

  return (
    <input
      className={`day-entry--moment--input ${isPast || (isToday && new Date().getHours() > 12 && AM) ? "no-background with-little-opacity" : ""} ${isFuture ? 'with-max-opacity' : ''}`}
      placeholder={isToday && isCurrentDayMoment ? '...' : '-'}
      // defaultValue={value === null ? '-' : value}
      defaultValue={value}
      type="number"
      pattern="\d*"
      // id="price-input"
      // name="price-input"
    />
  );
};

const DayEntry = ({ price }) => {
  return (
    <div className="day-entry--container">
      <span className="day-entry--label">{price.label}</span>
      <div className="day-entry--moment--container">
        <div className="day-entry--moment">
          <span className="day-entry--moment--label">AM</span>
          <DayEntryInput
            isPast={price.isPast}
            isFuture={price.isFuture}
            value={price.AM}
            AM
          />
        </div>

        <div className="day-entry--moment">
          <span className="day-entry--moment--label">PM</span>
          <DayEntryInput
            isPast={price.isPast}
            isFuture={price.isFuture}
            value={price.PM}
            PM
          />
        </div>
      </div>
    </div>
  );
};

const WeekPrices = ({ trend }) => {
  let prices = Object.values(trend.prices);
  const dayCount = new Date().getDay() - 1;

  prices = prices.map((price, i) => ({
    ...price,
    label: DAYS[i + 1],
    isPast: i < dayCount,
    isFuture: i > dayCount
  }));
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
