import React, { useEffect, useState, useContext } from "react";
import { Redirect } from "react-router-dom";

import { Icon } from "semantic-ui-react";
import { AppContext } from "../../contexts";
import {
  getUser,
  fetchTrend,
  setWeekPrices,
  setOwnedQuantity,
  setOwnedPrice,
  setSundayPrice,
} from "../../services";
import { WithLoader } from "../lib";
import AvatarDefault from "../../res/images/avatar-default.png";
import { formatAvatarData } from "./lib";
import { WeekPrices, TurnipsOwned } from "./";
import { getLastSunday, useFetch } from "../../utils";

const Avatar = ({ trend }) => (
  <div className="avatar-header--container">
    <img
      className="avatar-header--image"
      src={trend.author.avatar || AvatarDefault}
      alt="avatar"
    />

    <span className="nook-pseudo">{trend.author.pseudo}</span>
  </div>
);

const DetailedView = ({ pseudo }) => {
  const {
    state: { currentUser },
  } = useContext(AppContext);

  const [isSelf, setIsSelf] = useState(false);
  const [trend, setTrend] = useState(null);
  const [timer, setTimer] = useState(null);
  const [redirectToDetailed, setRedirectToDetailed] = useState(null);

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

      setTrend({
        ...trend,
        prices,
      });

      if (timer) clearTimeout(timer);
      // Reset flags
      setTimer(
        setTimeout(() => {
          prices[day].isUpdated = undefined;
          setTrend({
            ...trend,
            prices,
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

      setTrend(trend);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChangedPrice = async (newPrice) => {
    try {
      const trend = await setOwnedPrice(getLastSunday(), newPrice);

      setTrend(trend);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChangedSundayPrice = async (sundayPrice) => {
    try {
      const trend = await setSundayPrice(getLastSunday(), sundayPrice);

      setTrend(trend);
    } catch (err) {
      console.log(err);
    }
  };

  const { response: user = {}, isLoading: userLoading, error } = useFetch(
    getUser,
    { params: [pseudo] },
    []
  );
  const userId = user._id;

  useEffect(() => {
    setIsSelf(currentUser._id === userId);
  }, [userId]);

  const { response: fetchedTrend = {}, isLoading: trendLoading } = useFetch(
    fetchTrend,
    { params: [userId, getLastSunday()], conditions: !!userId },
    [userId]
  );
  const trendId = fetchedTrend._id
  useEffect(() => {
    if (trendId)
      setTrend(formatAvatarData(fetchedTrend));
  }, [trendId]);


  if (redirectToDetailed) return <Redirect to={"/turnip-trend"} push />;

  return (
    <div>
      <WithLoader
        active={userLoading || trendLoading}
        content={
          <>
            Recherche du correspondant{" "}
            <span role="img" aria-label="hold-emoji">
              ✋
            </span>
          </>
        }
      >
        <div className="detailled-view--container">
          <div
            className="back-button"
            onClick={() => setRedirectToDetailed(true)}
          >
            <Icon name="angle left" size="big" />
          </div>

          {trend && (
            <>
              <Avatar trend={trend} />

              <WeekPrices
                trend={trend}
                setWeekPrice={setWeekPrice}
                isEditable={isSelf}
              />

              {isSelf && (
                <TurnipsOwned
                  trend={trend}
                  handleChangedQuantity={handleChangedQuantity}
                  handleChangedPrice={handleChangedPrice}
                  handleChangedSundayPrice={handleChangedSundayPrice}
                />
              )}
            </>
          )}
        </div>
      </WithLoader>
    </div>
  );
};

export default DetailedView;
