import React, { useEffect, useState, useContext } from "react";
import { Loader } from "semantic-ui-react";

import { AppContext } from "../../contexts";
import { fetchAllTrends, fetchTrend } from "../../services";
import { WithLoader } from "../lib";
import { SundayInput, SundayPrices, TurnipOwnedInput } from "./";
import { formatAvatarData } from "./lib";
import { getLastSunday } from "../../utils";

const bySundayPriceAmount = (a, b) => (a.sundayPrice < b.sundayPrice ? -1 : 1);

const SundayView = ({ onSelfTrendClick }) => {
  const {
    state: { currentUser },
  } = useContext(AppContext);

  const [trends, setTrends] = useState([]);
  const [selfTrend, setSelfTrend] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [askForPrice, setAskForPrice] = useState(false);
  const [askForTurnips, setAskForTurnips] = useState(false);

  const fetchTrends = async () => {
    try {
      setIsLoading(true);

      let [fetchedTrends, fetchedSelfTrend] = await Promise.all([
        fetchAllTrends(getLastSunday(), true),
        fetchTrend(currentUser._id, getLastSunday()),
      ]);

      fetchedTrends = fetchedTrends
        .map(formatAvatarData)
        .sort(bySundayPriceAmount);

      setTrends(fetchedTrends);

      if (fetchedSelfTrend) {
        setSelfTrend(
          fetchedTrends.find((trend) => trend.author._id === currentUser._id)
        );

        if (!fetchedSelfTrend.sundayPrice) setAskForPrice(true);

        if (
          !fetchedSelfTrend.turnipsOwned ||
          !fetchedSelfTrend.turnipsOwnedValue
        )
          setAskForTurnips(true);
      } else {
        setAskForPrice(true);
        setAskForTurnips(true);
      }
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

  return (
    <>
      <WithLoader
        active={isLoading}
        content={
          <>
            Nous interrogeons Porcelette{" "}
            <span role="img" aria-label="pig-emoji">
              🐷
            </span>
          </>
        }
      >
        <div>
          {askForPrice && <SundayInput updateTrends={updateTrends} />}

          {askForTurnips && (
            <TurnipOwnedInput
              updateTrends={updateTrends}
              turnipsOwned={selfTrend && selfTrend.turnipsOwned}
              turnipsOwnedValue={selfTrend && selfTrend.turnipsOwnedValue}
            />
          )}

          <SundayPrices
            prices={trends.map(({ sundayPrice, _id, author }) => ({
              sundayPrice,
              _id,
              author,
            }))}
            currentUserId={currentUser._id}
            onSelfTrendClick={onSelfTrendClick}
          />
        </div>
      </WithLoader>
    </>
  );
};

export default SundayView;
