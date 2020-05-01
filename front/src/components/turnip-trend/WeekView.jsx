import React, { useEffect, useState, useContext } from "react";
import { Loader } from "semantic-ui-react";
import { useParams } from "react-router-dom";

import { AppContext } from "../../contexts";
import { fetchTurnipPrices, fetchTrend } from "../../services";
import { BuyingPrices, TrendInput } from "./";
import { formatAvatarData } from './lib';

const byPriceAmount = (a, b) => (a.price < b.price ? 1 : -1);

const WeekView = () => {
  const {
    state: { currentUser },
  } = useContext(AppContext);

  const { pseudo } = useParams();
  const [prices, setPrices] = useState([]);
  const [selfTrend, setSelfTrend] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [askForPrice, setAskForPrice] = useState(false);

  const updatePrices = (updatedPrice) => {
    const newPrices = [
      ...prices.filter((price) => price._id !== updatedPrice._id),
      formatAvatarData(updatedPrice),
    ].sort(byPriceAmount);

    setPrices(newPrices);
  };

  const fetchPrices = async () => {
    try {
      setIsLoading(true);

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const lastSunday = new Date(
        today.setDate(today.getDate() - today.getDay())
      );

      let fetchedTrend = await fetchTrend(currentUser._id, lastSunday);

      setSelfTrend(fetchedTrend);

      let turnipPrices = await fetchTurnipPrices(
        now.getDay(),
        now.getHours(),
        lastSunday
      );

      turnipPrices = turnipPrices.map(formatAvatarData).sort(byPriceAmount);

      setPrices(turnipPrices);

      if (turnipPrices.length) {
        const haveSelfCurrentPrice = turnipPrices.some(
          (price) => price.author._id === currentUser._id
        );
        setAskForPrice(!haveSelfCurrentPrice);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) fetchPrices();
  }, [currentUser]);

  useEffect(() => {
    if (!askForPrice) {
      if (prices.length) {
        const haveSelfCurrentPrice = prices.some(
          (price) => price.author._id === currentUser._id
        );
        setAskForPrice(!haveSelfCurrentPrice);
      } else setAskForPrice(true);
    }
  }, [prices]);

  return (
    <>
      {isLoading ? (
        <Loader
          active
          inline="centered"
          size="big"
          style={{ marginTop: "5rem" }}
        >
          Nos meilleurs ingénieurs sont sur le coup <span role='img' aria-label='computing-emoji'>👨‍💻</span>
        </Loader>
      ) : (
        <>
          {askForPrice && <TrendInput updatePrices={updatePrices} />}
          <BuyingPrices
            prices={prices}
            turnipsOwnedValue={selfTrend && selfTrend.turnipsOwnedValue}
            turnipsOwned={selfTrend && selfTrend.turnipsOwned}
          />
        </>
      )}
    </>
  );
};

export default WeekView;
