import React, { useEffect, useState, useContext } from "react";
import { ParentSize, withParentSize } from "@vx/responsive";
import { scaleLinear, scaleTime } from "@vx/scale";
import { AreaClosed } from "@vx/shape";
import { Group } from "@vx/group";
import { curveCatmullRom } from "@vx/curve";

const extent = (arr, fn) => [min(arr, fn), max(arr, fn)];

const min = (arr, fn) => Math.min(...arr.map(fn));
const max = (arr, fn) => Math.max(...arr.map(fn));

const Graph = withParentSize(({ weekValues, parentHeight, parentWidth }) => {
  const x = (d) => d.day;
  const y = (d) => d.value;

  const xScale = scaleLinear({
    range: [0, parentWidth],
    domain: extent(weekValues, x),
  });

  const yScale = scaleLinear({
    range: [parentHeight, 0],
    domain: extent(weekValues, y),
  });

  return (
    <svg width={parentWidth} height={parentHeight}>
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#87C9A1" stopOpacity={0.7} />
          <stop offset="100%" stopColor="#8ED680" stopOpacity={0.2} />
        </linearGradient>
      </defs>

      <Group top={0} left={0}>
        <AreaClosed
          data={weekValues}
          fill={"url(#gradient)"}
          x={(d) => xScale(x(d))}
          y={(d) => yScale(y(d))}
          yScale={yScale}
          xScale={xScale}
        />
      </Group>
    </svg>
  );
});

const WeekGraph = ({ trend }) => {
  const f = (day) => [day[1].AM, day[1].PM];
  let weekValues = Object.entries(trend.prices);
  weekValues = weekValues.map((pair) => f(pair)).flat();
  weekValues = weekValues.map((value, i) => ({ day: i, value }));

  return (
    <div style={{ height: 200, width: "50%" }}>
      <Graph weekValues={weekValues} />
    </div>
  );
};

export default WeekGraph;
