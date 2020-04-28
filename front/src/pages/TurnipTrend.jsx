import React, { useEffect, useState, useContext } from "react";

import "./TurnipTrend.css";
import { AppContext } from "../contexts";
import {fetchTurnipPrices} from "../services";
import { BuyingPrice } from "../components/turnip-trend";
import { Button, Header, Divider, Loader } from "semantic-ui-react";
import { useParams } from "react-router-dom";

const TurnipTrend = () => {
  const { pseudo } = useParams();
  const [trends, setTrends] = useState([]);

  const fetchPrices = async () => {
    try {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const lastSunday = new Date(today.setDate(today.getDate()-today.getDay()));
      console.log(lastSunday);

      let turnipTrends = await fetchTurnipPrices(now.getDay(), now.getHours(), lastSunday);
      console.log(turnipTrends);
      turnipTrends = turnipTrends.map((trend) => ({
        ...trend,
        author: {
          ...trend.author,
          avatar: Buffer.from(trend.author.avatar.data, "base64"),
        }
      }));

      setTrends(turnipTrends);
    } catch (err) {
    } finally {
    }
  };
  console.log(trends);
  useEffect(() => {
    fetchPrices();
  }, []);

  return <div>
    <BuyingPrice trends={trends}/>
  </div>;
};

export default TurnipTrend;
