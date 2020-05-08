import React, { useState, useContext, useEffect } from "react";
import { Dimmer, Loader } from "semantic-ui-react";

import { TurnipContext } from "../../contexts";
import { setTrendType } from "../../services";

const TrendTypeInput = ({ trend }) => {
  const { dispatch } = useContext(TurnipContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleTrendTypeChange = async (type) => {
    if (type === trend.trendType) return;

    setIsLoading(true);

    try {
      const fetchedTrend = await setTrendType(trend._id, null, type);

      dispatch({ type: "UPDATE_TREND", trend: fetchedTrend });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setIsLoading(false);
  }, [trend]);

  return (
    <div className="trend-type--container">
      <Dimmer inverted active={isLoading}>
        <Loader/>
      </Dimmer>

      <div className="trend-type--buttons">
        <button
          className={`trend-type--button ${
            trend.trendType === "UNKNOWN" ? "active" : ""
          }`}
          onClick={() => handleTrendTypeChange("UNKNOWN")}
        >
          🤷‍♀️
        </button>
        <button
          className={`trend-type--button ${
            trend.trendType === "VARIABLE" ? "active" : ""
          }`}
          onClick={() => handleTrendTypeChange("VARIABLE")}
        >
          Variable
        </button>
        <button
          className={`trend-type--button ${
            trend.trendType === "SMALL_SPIKE" ? "active" : ""
          }`}
          onClick={() => handleTrendTypeChange("SMALL_SPIKE")}
        >
          Petit pic
        </button>
        <button
          className={`trend-type--button ${
            trend.trendType === "BIG_SPIKE" ? "active" : ""
          }`}
          onClick={() => handleTrendTypeChange("BIG_SPIKE")}
        >
          Grand pic
        </button>
        <button
          className={`trend-type--button ${
            trend.trendType === "DECREASING" ? "active" : ""
          }`}
          onClick={() => handleTrendTypeChange("DECREASING")}
        >
          Décroissante
        </button>
      </div>
      <span className="week-prices--label">Ta tendance de cette semaine</span>
    </div>
  );
};

export default TrendTypeInput;
