import React, { useEffect, useState, useContext } from "react";
import { scaleLinear, scaleTime } from '@vx/scale';
import { AreaClosed } from "@vx/shape";
import { Group } from "@vx/group";
import { curveCatmullRom } from '@vx/curve';

const extent = (arr, fn) => [min(arr, fn), max(arr, fn)];

const min = (arr, fn) => Math.min(...arr.map(fn));
const max = (arr, fn) => Math.max(...arr.map(fn));

const WeekGraph = ({ trend }) => {
  const f = (day) => [day[1].AM, day[1].PM];
  let weekValues = Object.entries(trend.prices);
  weekValues = weekValues.map(pair => f(pair)).flat();
  weekValues = weekValues.map((value, i) => ({day: i, value}));

  const x = d => d.day;
  const y = d => d.value;

  const xScale = scaleLinear({
    range: [0, 1000],
    // domain: [0, 12],
    domain: extent(weekValues, x)
  });

  const yScale = scaleLinear({
    range: [200, 0],
    // domain: [0, 250],
    domain: extent(weekValues, y)
  });

  return (
    <div>
      <svg width={1000} height={200}>
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#87C9A1" stopOpacity={0.70} />
            <stop offset="100%" stopColor="#8ED680" stopOpacity={0.2} />
          </linearGradient>
        </defs>

        <Group top={0} left={0}>
          <AreaClosed
            data={weekValues}
            // xScale={xScale}
            // yScale={yScale}
            // x={x}
            // y={y}
            // fill={"red"}
            fill={'url(#gradient)'}
            x={d => xScale(x(d))}
            y={d => yScale(y(d))}
            yScale={yScale}
            xScale={xScale}
          />
        </Group>
      </svg>
    </div>
  );
};

export default WeekGraph;
