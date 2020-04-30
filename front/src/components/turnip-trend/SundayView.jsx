import React, { useEffect, useState, useContext } from "react";
import { Loader } from "semantic-ui-react";
import { useParams } from "react-router-dom";

import { AppContext } from "../../contexts";
import { fetchAllTrends } from "../../services";
import { SundayInput, SundayPrices, TurnipOwnedInput } from "./";

const formatAvatarData = ({ author, ...rest }) => ({
  ...rest,
  author: {
    ...author,
    avatar: Buffer.from(author.avatar.data, "base64"),
  },
});

const bySundayPriceAmount = (a, b) => (a.sundayPrice < b.sundayPice ? -1 : 1);

const SundayView = () => {
  const {
    state: { currentUser, isAutoConnecting },
  } = useContext(AppContext);

  const [prices, setPrices] = useState([]);
  const [trends, setTrends] = useState([]);
  const [selfTrend, setSelfTrend] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [askForPrice, setAskForPrice] = useState(false);
  const [askForTurnips, setAskForTurnips] = useState(false);

  const fetchTrends = async () => {
    try {
      setIsLoading(true);

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const lastSunday = new Date(
        today.setDate(today.getDate() - today.getDay())
      );

      let fetchedTrends = await fetchAllTrends(lastSunday);

      fetchedTrends = fetchedTrends.map(formatAvatarData).sort(bySundayPriceAmount);

      setTrends(fetchedTrends);

      const fetchedSelfTrend = fetchedTrends.find((trend) => trend.author._id === currentUser._id);

      if (fetchedSelfTrend) {
        setSelfTrend(
          fetchedTrends.find((trend) => trend.author._id === currentUser._id)
        );
          console.log(fetchedSelfTrend);
        if (!fetchedSelfTrend.sundayPrice) setAskForPrice(true);

        if (!fetchedSelfTrend.turnipsOwned || !fetchedSelfTrend.turnipsOwnedValue) setAskForTurnips(true);
        setAskForTurnips(true);
      }
      else setAskForPrice(true);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTrends = (newTrend) => {
    setSelfTrend(newTrend);

    const newTrends = [
      ...trends.filter((trend) => trend._id !== newTrend._id),
      formatAvatarData(newTrend),
    ].sort(bySundayPriceAmount);

    setTrends(newTrends);
  };

  useEffect(() => {
      fetchTrends();
  }, []);
  console.log(selfTrend && selfTrend.turnipsOwned);
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
        <div>
          {askForPrice && <SundayInput updateTrends={updateTrends}/>}

          {askForTurnips && <TurnipOwnedInput updateTrends={updateTrends} turnipsOwned={selfTrend.turnipsOwned} turnipsOwnedValue={selfTrend.turnipsOwnedValue}/>}
          
          <SundayPrices
            prices={trends.map(({sundayPrice, _id, author}) => ({sundayPrice, _id, author}))}
          />
        </div>
      )}
    </>
  );
};

export default SundayView;
