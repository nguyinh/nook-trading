import React, { useState, useContext } from "react";

import { TurnipContext } from "../../contexts";
import { withParentSize } from "@vx/responsive";
import { scaleLinear } from "@vx/scale";
import { AreaClosed, LinePath } from "@vx/shape";
import { Group } from "@vx/group";
import { curveMonotoneX } from "@vx/curve";
import { LinearGradient } from "@vx/gradient";
import { Redirect } from "react-router-dom";

const extent = (arr, fn) => [min(arr, fn), max(arr, fn)];
const addPadding = (arr, lowOffset, highOffset) => [
  lowOffset < 1 ? arr[0] - arr[1] * lowOffset : arr[0] - lowOffset,
  highOffset < 1 ? arr[1] + arr[1] * highOffset : arr[1] + highOffset,
];

const min = (arr, fn) => Math.min(...arr.map(fn));
const max = (arr, fn) => Math.max(...arr.map(fn));

const Graph = withParentSize(({ weekValues, parentHeight, parentWidth }) => {
  const x = (d) => d.day;
  const y = (d) => d.value;

  const xScale = scaleLinear({
    range: [0, parentWidth],
    domain: [1, 12],
  });

  const yScale = scaleLinear({
    range: [parentHeight, 0],
    domain: addPadding(extent(weekValues, y), 20, 20),
    // nice: true
  });

  return (
    <svg width={parentWidth} height={parentHeight}>
      <defs>
        <LinearGradient
          id="gradient"
          fromOpacity={0.8}
          toOpacity={0.1}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
          from="#87C9A1"
          to="#8ED680"
        />
      </defs>

      <Group top={0} left={0}>
        <AreaClosed
          data={weekValues}
          fill={"url(#gradient)"}
          x={(d) => xScale(x(d))}
          y={(d) => yScale(y(d))}
          yScale={yScale}
          xScale={xScale}
          defined={(d) => y(d)}
          curve={curveMonotoneX}
        />

        <LinePath
          data={weekValues}
          x={(d) => xScale(x(d))}
          y={(d) => yScale(y(d))}
          defined={(d) => y(d)}
          stroke="#A6D5B3"
          strokeWidth={2}
          curve={curveMonotoneX}
        />

        {weekValues.filter(y).map((d) => (
          <circle
            cx={xScale(x(d))}
            cy={yScale(y(d))}
            r={3}
            fill="#87C9A1"
            stroke="white"
            strokeWidth={1}
            style={{ pointerEvents: "none" }}
          />
        ))}
      </Group>
    </svg>
  );
});

const WeekGraph = ({ trend, withPseudo, currentUserId }) => {
  const { dispatch } = useContext(TurnipContext);

  const [redirectToDetailed, setRedirectToDetailed] = useState(null);
  const isSelfGraph = (trend) => currentUserId === trend.author._id;
  const f = (day) => [day[1].AM, day[1].PM];
  let weekValues = Object.entries(trend.prices);
  weekValues = weekValues.map((pair) => f(pair)).flat();
  weekValues = weekValues.map((value, i) => ({
    day: i + 1,
    value,
  }));

  if (redirectToDetailed)
    return <Redirect to={`/turnip-trend/${redirectToDetailed}`} push />;

  return (
    <div
      style={{ height: 150 }}
      className="detailed-view--graph-container"
      onClick={() =>
        withPseudo &&
        (isSelfGraph(trend)
          ? dispatch({ type: "GO_TO_PAGE", page: 2 })
          : setRedirectToDetailed(trend.author.pseudo))
      }
    >
      {withPseudo && (
        <span className="detailed-view--graph-container--pseudo">
          {trend.author.pseudo}
        </span>
      )}
      <Graph weekValues={weekValues} />
    </div>
  );
};

export default WeekGraph;
