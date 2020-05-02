import React, { useState } from "react";

const DAYS = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];

const DayEntryInput = ({
  value,
  isPast,
  isFuture,
  day,
  AM,
  PM,
  setWeekPrice,
}) => {
  const isCurrentDayMoment = new Date().getHours() < 12 ? AM : PM;
  const isToday = !isPast && !isFuture;

  const [timer, setTimer] = useState(null);

  const handleChange = (value) => {
    if (timer) clearTimeout(timer);
    setTimer(
      setTimeout(() => setWeekPrice(day, AM ? "AM" : "PM", parseInt(value) || null), 1000)
    );
  };

  return (
    <input
      className={`day-entry--moment--input ${
        isPast || (isToday && new Date().getHours() > 12 && AM)
          ? "no-background with-little-opacity"
          : ""
      } ${isFuture ? "with-max-opacity" : ""}`}
      placeholder={isToday && isCurrentDayMoment ? "..." : "-"}
      // defaultValue={value === null ? '-' : value}
      defaultValue={value}
      type="number"
      pattern="\d*"
      onChange={(e) => handleChange(e.target.value)}
      // id="price-input"
      // name="price-input"
    />
  );
};

const DayEntry = ({ price, setWeekPrice }) => {
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
            day={price.code}
            AM
            setWeekPrice={setWeekPrice}
          />
        </div>

        <div className="day-entry--moment">
          <span className="day-entry--moment--label">PM</span>
          <DayEntryInput
            isPast={price.isPast}
            isFuture={price.isFuture}
            value={price.PM}
            day={price.code}
            PM
            setWeekPrice={setWeekPrice}
          />
        </div>
      </div>
    </div>
  );
};

const WeekPrices = ({ trend, setWeekPrice }) => {
  let prices = Object.values(trend.prices);
  const dayCodes = Object.keys(trend.prices);
  const dayCount = new Date().getDay() - 1;

  prices = prices.map((price, i) => ({
    ...price,
    label: DAYS[i + 1],
    code: dayCodes[i],
    isPast: i < dayCount,
    isFuture: i > dayCount,
  }));

  return (
    <div className="week-prices--container">
      <div className="week-prices--prices">
        {prices.map((price, i) => (
          <DayEntry
            price={price}
            setWeekPrice={setWeekPrice}
            key={`entry-${price.code}-${i % 2 ? "AM" : "PM"}`}
          />
        ))}
      </div>

      <span className="week-prices--label">Semaine du </span>
    </div>
  );
};

export default WeekPrices;
