import React, { useState, useMemo } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";

import { getLastSunday } from "../../utils";
import { ReactComponent as Check } from "../../res/images/little-check.svg";

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
  isEditable,
}) => {
  const [timer, setTimer] = useState(null);

  if (!isEditable)
    return <span className="day-entry--moment--value">{value || "-"}</span>;

  const isCurrentDayMoment = new Date().getHours() < 12 ? AM : PM;
  const isToday = !isPast && !isFuture;

  const handleChange = (value) => {
    if (timer) clearTimeout(timer);
    setTimer(
      setTimeout(
        () => setWeekPrice(day, AM ? "AM" : "PM", parseInt(value) || null),
        1000
      )
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
      defaultValue={value}
      type="number"
      pattern="\d*"
      onChange={(e) => handleChange(e.target.value)}
      // id="price-input"
      // name="price-input"
    />
  );
};

const AnimatedMomentLabel = ({ label, isUpdated }) => (
  <SwitchTransition mode="out-in">
    <CSSTransition
      key={isUpdated === label ? "1" : "2"}
      addEndListener={(node, done) =>
        node.addEventListener("transitionend", done, false)
      }
      classNames="entry-validation-anim"
    >
      {isUpdated === label ? (
        <span className="day-entry--moment--label no-opacity">
          <Check />
        </span>
      ) : (
        <span className="day-entry--moment--label">{label}</span>
      )}
    </CSSTransition>
  </SwitchTransition>
);

const DayEntry = ({ price, setWeekPrice, isEditable }) => (
  <div className="day-entry--container">
    <span className="day-entry--label">{price.label}</span>
    <div className="day-entry--moment--container">
      <div className="day-entry--moment">
        <AnimatedMomentLabel label="AM" isUpdated={price.isUpdated} />

        <DayEntryInput
          isPast={price.isPast}
          isFuture={price.isFuture}
          value={price.AM}
          day={price.code}
          AM
          setWeekPrice={setWeekPrice}
          isEditable={isEditable}
        />
      </div>

      <div className="day-entry--moment">
        <AnimatedMomentLabel label="PM" isUpdated={price.isUpdated} />

        <DayEntryInput
          isPast={price.isPast}
          isFuture={price.isFuture}
          value={price.PM}
          day={price.code}
          PM
          setWeekPrice={setWeekPrice}
          isEditable={isEditable}
        />
      </div>
    </div>
  </div>
);

const WeekPrices = ({ trend, setWeekPrice, isEditable }) => {
  let prices = Object.values(trend.prices);
  const dayCodes = Object.keys(trend.prices);
  const dayCount = new Date().getDay() - 1;

  const weekRange = useMemo(() => {
    const f = (d) => (d < 10 ? `0${d}` : d);

    const sunday = getLastSunday();
    let nextSaturday = new Date(getLastSunday());
    nextSaturday = new Date(nextSaturday.setDate(nextSaturday.getDate() + 6));
    return `${f(sunday.getDate())}/${f(sunday.getMonth() + 1)} au ${f(
      nextSaturday.getDate()
    )}/${f(nextSaturday.getMonth() + 1)}`;
  }, []);

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
            isEditable={isEditable}
          />
        ))}
      </div>

      <span className="week-prices--label">Semaine du {weekRange}</span>
    </div>
  );
};

export default WeekPrices;
