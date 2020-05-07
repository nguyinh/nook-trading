import React, { useEffect, useState, useContext } from "react";
import { Redirect } from "react-router-dom";

import {fetchAllTrends} from '../../services';
import { AppContext } from "../../contexts";
import { getLastSunday } from "../../utils";
import { WeekGraph } from './';

const WeekGraphsView = ({  }) => {
  const {
    state: { currentUser },
  } = useContext(AppContext);

  const [trends, setTrends] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const fetchUserTrend = async (pseudo) => {
    setIsLoading(true);
    try {
      const fetechedTrends = await fetchAllTrends(getLastSunday());

      setTrends(fetechedTrends);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserTrend();
  }, []);

  return <>
  {
    trends && (
      trends.map(({author, prices}) => <WeekGraph trend={{author, prices}} withPseudo/>)
    )
  }
  </>;
};

export default WeekGraphsView;
