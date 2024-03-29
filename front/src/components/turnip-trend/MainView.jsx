import React, { useContext } from "react";
import Slider from "react-slick";

import { AppContext, TurnipContext } from "../../contexts";
import { WeekView, SundayView, DetailedView, WeekGraphsView } from ".";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { WithLoader } from "../lib";
import { Redirect } from "react-router-dom";

const MainView = () => {
  const {
    state: { currentUser },
  } = useContext(AppContext);

  const {
    state: {
      trends,
      selfTrend,
      isLoadingTrends,
      isLoadingSelfTrend,
      sliderRef,
    },
  } = useContext(TurnipContext);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 1,
    arrows: false,
    // adaptiveHeight: true
  };

  const isSunday = new Date().getDay() === 0;

  // const [firstClientX, setFirstClientX] = useState();
  // const [firstClientY, setFirstClientY] = useState();
  // const [clientX, setClientX] = useState();

  // useEffect(() => {
  //   const touchStart = e => {
  //     setFirstClientX(e.touches[0].clientX);
  //     setFirstClientY(e.touches[0].clientY);
  //   };

  //   const preventTouch = e => {
  //     const minValue = 5; // threshold

  //     setClientX(e.touches[0].clientX - firstClientX);

  //     // Vertical scrolling does not work when you start swiping horizontally.
  //     if (Math.abs(clientX) > minValue) {
  //       e.preventDefault();
  //       e.returnValue = false;
  //       return false;
  //     }
  //   };

  //   window.addEventListener('touchstart', touchStart);
  //   window.addEventListener('touchmove', preventTouch, { passive: false });
  //   return () => {
  //     window.removeEventListener('touchstart', touchStart);
  //     window.removeEventListener('touchmove', preventTouch, {
  //       passive: false,
  //     });
  //   };
  // }, [clientX, firstClientX, firstClientY]);

  return (
    <div className="turnip-trend--slick">
      <Slider {...settings} ref={sliderRef}>
        <WeekGraphsView />

        <WithLoader active={isLoadingTrends || isLoadingSelfTrend}>
          {trends ? <>{isSunday ? <SundayView /> : <WeekView />}</> : null}
        </WithLoader>

        <DetailedView
          trend={selfTrend}
          isSelf
          pseudo={currentUser.pseudo}
          allowBackTo={false}
        />
      </Slider>
    </div>
  );
};

export default MainView;
