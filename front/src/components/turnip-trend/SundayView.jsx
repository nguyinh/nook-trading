import React, { useEffect, useState, useContext } from "react";
import { Loader } from "semantic-ui-react";
import { useParams } from "react-router-dom";

import { AppContext } from "../../contexts";
import { fetchTurnipPrices, fetchAllTrends } from "../../services";
import { BuyingPrice, TrendInput } from ".";

const SundayView = () => {
  const {
    state: { currentUser, isAutoConnecting },
  } = useContext(AppContext);

  const [prices, setPrices] = useState([]);
  const [trends, setTrends] = useState([]);
  const [selfTrend, setSelfTrend] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [askForPrice, setAskForPrice] = useState(false);

  const fetchTrends = async () => {
    try {
      setIsLoading(true);

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const lastSunday = new Date(
        today.setDate(today.getDate() - today.getDay())
      );

      let fetchedTrends = await fetchAllTrends(lastSunday);
      console.log(fetchedTrends);

      setTrends(fetchedTrends);
      setSelfTrend(
        fetchedTrends.find((trend) => trend.author._id === currentUser._id)
      );
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) fetchTrends();
  }, [currentUser]);

  useEffect(() => {
    if (!askForPrice && selfTrend) {
      if (!selfTrend.sundayPrice) setAskForPrice(true);
    }
  }, [selfTrend]);

  return (
    <>
      {isLoading ? (
        <Loader
          active
          inline="centered"
          size="big"
          style={{ marginTop: "5rem" }}
        >
          Nous interrogeons Porcelette 🐷
        </Loader>
      ) : (
        <>
          {/* // TODO: Replace this for sunday */}
          {askForPrice && 'Asking'}
          {/* <BuyingPrice
            prices={prices}
            turnipsOwnedValue={selfTrend.turnipsOwnedValue}
            turnipsOwned={selfTrend.turnipsOwned}
          /> */}
        </>
      )}
    </>
  );
};

export default SundayView;
