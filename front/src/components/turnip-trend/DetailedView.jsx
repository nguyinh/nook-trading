import React, { useEffect, useState, useContext } from "react";
import { Loader } from "semantic-ui-react";

import { AppContext } from "../../contexts";
import { getUser, fetchTrend } from "../../services";
import { WithLoader } from "../lib";
import AvatarDefault from "../../res/images/avatar-default.png";
import { formatAvatarData } from "./lib";
import { WeekPrices } from "./";

const Avatar = ({ trend }) => {
  return (
    <div className="avatar-header--container">
      <img
        className="avatar-header--image"
        src={trend.author.avatar || AvatarDefault}
        alt="avatar"
      />

      <span className="nook-pseudo">{trend.author.pseudo}</span>
    </div>
  );
};

const DetailedView = ({ pseudo }) => {
  const {
    state: { currentUser },
  } = useContext(AppContext);

  const [isLoading, setIsLoading] = useState(true);
  const [isSelf, setIsSelf] = useState(false);
  const [trend, setTrend] = useState(null);

  const fetchUserTrend = async (pseudo) => {
    setIsLoading(true);
    try {
      const { _id } = await getUser(pseudo);

      setIsSelf(currentUser._id === _id);

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const thisSunday = new Date(
        today.setDate(today.getDate() - today.getDay())
      );

      const fetchedTrend = await fetchTrend(_id, thisSunday);

      setTrend(formatAvatarData(fetchedTrend));
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserTrend(pseudo);
  }, []);

  return (
    <div>
      <WithLoader active={isLoading}>
        <div className="detailled-view--container">
          {trend && (
            <>
              <Avatar trend={trend} />

              <WeekPrices trend={trend} />
            </>
          )}
        </div>
      </WithLoader>
    </div>
  );
};

export default DetailedView;
