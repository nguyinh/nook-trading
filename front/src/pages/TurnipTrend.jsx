import React, { useEffect, useState, useContext } from "react";

import "./TurnipTrend.css";
import { AppContext } from "../contexts";
import { fetchTurnipPrices, fetchTrend } from "../services";
import { BuyingPrice } from "../components/turnip-trend";
import { Button, Header, Divider, Loader } from "semantic-ui-react";
import { useParams } from "react-router-dom";

const TurnipTrend = () => {
  const {
    state: { currentUser, isAutoConnecting },
    dispatch,
  } = useContext(AppContext);

  const { pseudo } = useParams();
  const [prices, setPrices] = useState([]);
  const [selfTrend, setSelfTrend] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPrices = async () => {
    try {
      setIsLoading(true);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const lastSunday = new Date(
        today.setDate(today.getDate() - today.getDay())
      );
      console.log(lastSunday);

      let fetchedTrend = await fetchTrend(currentUser._id, lastSunday);
      console.log(fetchedTrend);
      setSelfTrend(fetchedTrend);

      let turnipPrices = await fetchTurnipPrices(
        now.getDay(),
        now.getHours(),
        lastSunday
      );
      console.log(turnipPrices);
      turnipPrices = turnipPrices.map((trend) => ({
        ...trend,
        author: {
          ...trend.author,
          avatar: Buffer.from(trend.author.avatar.data, "base64"),
        },
      }));

      setPrices(turnipPrices);

    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser)
      fetchPrices();
  }, [currentUser]);

  if (isAutoConnecting)
    return (
      <Loader active inline="centered" size="big" style={{ marginTop: "5rem" }}>
        Chargement de l'app ✋
      </Loader>
    );

  return (
    <div>
      {isLoading ? (
        <Loader
          active
          inline="centered"
          size="big"
          style={{ marginTop: "5rem" }}
        >
          Calcul par nos meilleurs ingénieurs
        </Loader>
      ) : (
        <BuyingPrice
          prices={prices}
          priceByTurnip={selfTrend.priceByTurnip}
          turnipsOwned={selfTrend.turnipsOwned}
        />
      )}
    </div>
  );
};

export default TurnipTrend;
