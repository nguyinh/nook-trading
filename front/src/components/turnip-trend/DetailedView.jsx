import React, { useState, useContext } from "react";
import { Redirect } from "react-router-dom";

import { Icon } from "semantic-ui-react";
import { AppContext } from "../../contexts";
import {
  setWeekPrices,
  setOwnedQuantity,
  setOwnedPrice,
  setSundayPrice,
} from "../../services";
import AvatarDefault from "../../res/images/avatar-default.png";
import { WeekPrices, TurnipsOwned, WeekGraph } from "./";
import { getLastSunday } from "../../utils";

const Avatar = ({ trend, onClick }) => (
  <div className="avatar-header--container" onClick={onClick}>
    <img
      className="avatar-header--image"
      src={trend.author.avatar || AvatarDefault}
      alt="avatar"
    />

    <span className="nook-pseudo">{trend.author.pseudo}</span>
  </div>
);

const DetailedView = ({
  trend,
  isLoading,
  isSelf,
  pseudo,
  allowBackTo = true,
}) => {
  const {
    state: { currentUser },
    dispatch,
  } = useContext(AppContext);

  const [timer, setTimer] = useState(null);
  const [backToDetailed, setBackToDetailed] = useState(null);
  const [redirectToProfile, setRedirectToProfile] = useState(null);

  const setWeekPrice = async (day, moment, price) => {
    let { _id, prices } = trend;

    // Update specific price
    prices[day][moment] = price;

    // Clean prices before sending
    const keys = Object.keys(prices);
    keys.forEach(
      (key) => (prices[key] = { AM: prices[key].AM, PM: prices[key].PM })
    );

    try {
      const newTrend = await setWeekPrices(_id, prices);

      prices[day].isUpdated = moment;

      dispatch({
        type: "UPDATE_TREND",
        trend: {
          ...trend,
          prices,
        },
      });

      if (timer) clearTimeout(timer);
      // Reset flags
      setTimer(
        setTimeout(() => {
          prices[day].isUpdated = undefined;
          dispatch({
            type: "UPDATE_TREND",
            trend: {
              ...trend,
              prices,
            },
          });
        }, 2000)
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleChangedQuantity = async (newQuantity) => {
    try {
      const trend = await setOwnedQuantity(getLastSunday(), newQuantity);

      dispatch({
        type: "UPDATE_TREND",
        trend
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleChangedPrice = async (newPrice) => {
    try {
      const trend = await setOwnedPrice(getLastSunday(), newPrice);

      dispatch({
        type: "UPDATE_TREND",
        trend
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleChangedSundayPrice = async (sundayPrice) => {
    try {
      const trend = await setSundayPrice(getLastSunday(), sundayPrice);

      dispatch({
        type: "UPDATE_TREND",
        trend
      });
    } catch (err) {
      console.log(err);
    }
  };

  const goToTurnipProphet = () => {
    const f = (day) => [day.AM, day.PM];
    const {
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
    } = trend.prices;
    const valueParams = [
      trend.sundayPrice,
      ...f(monday),
      ...f(tuesday),
      ...f(wednesday),
      ...f(thursday),
      ...f(friday),
      ...f(saturday),
    ];

    window.open(`https://turnipprophet.io/?prices=${valueParams.join(".")}`);
  };

  if (backToDetailed) return <Redirect to={"/turnip-trend"} push />;
  if (redirectToProfile)
    return <Redirect to={`/profile/${redirectToProfile}`} push />;

  return (
    <div>
      {/* <WithLoader
        active={isLoading}
        content={
          <>
            Recherche du correspondant{" "}
            <span role="img" aria-label="hold-emoji">
              ✋
            </span>
          </>
        }
      > */}
        <div className="detailled-view--container">
          {allowBackTo && (
            <div
              className="back-button"
              onClick={() => setBackToDetailed(true)}
            >
              <Icon name="angle left" size="big" />
            </div>
          )}

          {trend && (
            <>
              <Avatar
                trend={trend}
                onClick={() => setRedirectToProfile(trend.author.pseudo)}
              />

              <WeekGraph trend={trend} />

              <WeekPrices
                trend={trend}
                setWeekPrice={setWeekPrice}
                isEditable={isSelf}
              />

              {isSelf && (
                <>
                  <button
                    className="turnip-prophet-button"
                    onClick={goToTurnipProphet}
                  >
                    Simuler sur Turnip Prophet
                    <Icon name="external" />
                  </button>

                  <TurnipsOwned
                    trend={trend}
                    handleChangedQuantity={handleChangedQuantity}
                    handleChangedPrice={handleChangedPrice}
                    handleChangedSundayPrice={handleChangedSundayPrice}
                  />
                </>
              )}
            </>
          )}
        </div>
      {/* </WithLoader> */}
    </div>
  );
};

export default DetailedView;
