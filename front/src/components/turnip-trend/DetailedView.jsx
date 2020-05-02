import React, { useEffect, useState, useContext } from "react";
import { Loader } from "semantic-ui-react";

import { AppContext } from "../../contexts";
import { getUser, fetchTrend, setWeekPrices, setOwnedQuantity, setOwnedPrice } from "../../services";
import { WithLoader } from "../lib";
import AvatarDefault from "../../res/images/avatar-default.png";
import { formatAvatarData } from "./lib";
import { WeekPrices, TurnipsOwned } from "./";
import { getLastSunday } from '../../utils';

const Avatar = ({ trend }) => {
  return (
    <div className="avatar-header--container">
      <img
        className="avatar-header--image"
        src={trend.author.avatar || AvatarDefault}
        alt="avatar"
      />

      <span className="nook-pseudo">{trend.author.pseudo}</span>
    </div>
  );
};

const DetailedView = ({ pseudo }) => {
  const {
    state: { currentUser },
  } = useContext(AppContext);

  const [isLoading, setIsLoading] = useState(true);
  const [isSelf, setIsSelf] = useState(false);
  const [trend, setTrend] = useState(null);
  const [timer, setTimer] = useState(null);

  const fetchUserTrend = async (pseudo) => {
    setIsLoading(true);
    try {
      const { _id } = await getUser(pseudo);

      setIsSelf(currentUser._id === _id);

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const thisSunday = new Date(
        today.setDate(today.getDate() - today.getDay())
      );

      const fetchedTrend = await fetchTrend(_id, thisSunday);

      setTrend(formatAvatarData(fetchedTrend));
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

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
        prices
      });

      if (timer) clearTimeout(timer);
      // Reset flags
      setTimer(setTimeout(() => {
        prices[day].isUpdated = undefined;
        setTrend({
          ...trend,
          prices
        });
      }, 2000));
    } catch (err) {
      console.log(err);
    }
  };

  const handleChangedQuantity = async (newQuantity) => {
    try {
      const now = new Date();
      const today = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
      const thisSunday = new Date(
        today.setDate(today.getDate() - today.getDay())
      );

      const trend = await setOwnedQuantity(
        thisSunday,
        newQuantity
      );

      setTrend(trend);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChangedPrice = async (newPrice) => {
    try {
      const now = new Date();
      const today = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );

      const thisSunday = new Date(
        today.setDate(today.getDate() - today.getDay())
      );

      const trend = await setOwnedPrice(
        thisSunday,
        newPrice
      );

      setTrend(trend);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUserTrend(pseudo);
  }, []);

  return (
    <div>
      <WithLoader active={isLoading}>
        <div className="detailled-view--container">
          {trend && (
            <>
              <Avatar trend={trend} />

              <WeekPrices trend={trend} setWeekPrice={setWeekPrice} isEditable={isSelf}/>

              {isSelf && <TurnipsOwned trend={trend} handleChangedQuantity={handleChangedQuantity} handleChangedPrice={handleChangedPrice}/>}
            </>
          )}
        </div>
      </WithLoader>
    </div>
  );
};

export default DetailedView;
