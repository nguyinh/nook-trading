import React, { useEffect, useState, useContext } from "react";
import { Button, Header, Divider, Loader } from "semantic-ui-react";
import { useParams } from "react-router-dom";

import "./TurnipTrend.css";
import { AppContext } from "../contexts";
import { fetchTurnipPrices, fetchTrend } from "../services";
import { BuyingPrice } from "../components/turnip-trend";
import { ReactComponent as BellsPerTurnip } from "../res/images/bells-per-turnip-2.svg";
import { ReactComponent as Check } from "../res/images/little-check.svg";

const TrendInput = () => {
  return (
    <div className="turnip-input--container">
      <span>Quel est ton cours du navet ?</span>

      <div className="turnip-input">
        <BellsPerTurnip/>
        <input type="text" id="price-input" name="price-input" />
        <span className='turnip-input--label'>
          {/* prix */}
          {/* <Loader active inline size='mini'/> */}
          <Check style={{marginBottom: '-2px'}}/>
        </span>
      </div>
    </div>
  );
};

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
      turnipPrices = turnipPrices.map(({ author, ...rest }) => ({
        ...rest,
        author: {
          ...author,
          avatar: Buffer.from(author.avatar.data, "base64"),
        },
      }));

      setPrices(turnipPrices);
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) fetchPrices();
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
        <>
          <TrendInput />
          <BuyingPrice
            prices={prices}
            priceByTurnip={selfTrend.priceByTurnip}
            turnipsOwned={selfTrend.turnipsOwned}
          />
        </>
      )}
    </div>
  );
};

export default TurnipTrend;
