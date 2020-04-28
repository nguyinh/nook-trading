import React, { useEffect, useState, useContext } from "react";
import { Loader } from "semantic-ui-react";
import { useParams } from "react-router-dom";

import { AppContext } from "../../contexts";
import { fetchTurnipPrices, fetchTrend, addCurrentPrice } from "../../services";
import { BuyingPrice, TrendInput } from "./";

const formatAvatarData = ({ author, ...rest }) => ({
  ...rest,
  author: {
    ...author,
    avatar: Buffer.from(author.avatar.data, "base64"),
  },
});

const byPriceAmount = (a, b) => (a.price < b.price ? 1 : -1);

const WeekView = () => {
  const {
    state: { currentUser, isAutoConnecting },
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

  return (
    <>
      {isLoading ? (
        <Loader
          active
          inline="centered"
          size="big"
          style={{ marginTop: "5rem" }}
        >
          Nos meilleurs ingénieurs sont sur le coup 👨‍💻
        </Loader>
      ) : (
        <>
          {askForPrice && <TrendInput updatePrices={updatePrices} />}
          <BuyingPrice
            prices={prices}
            priceByTurnip={selfTrend.priceByTurnip}
            turnipsOwned={selfTrend.turnipsOwned}
          />
        </>
      )}
    </>
  );
};

export default WeekView;
