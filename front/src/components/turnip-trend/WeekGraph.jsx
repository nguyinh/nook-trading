import React, { useState, useContext, useMemo } from "react";
import { withParentSize } from "@vx/responsive";
import { scaleLinear } from "@vx/scale";
import { AreaClosed, LinePath, Bar, Line } from "@vx/shape";
import { Group } from "@vx/group";
import { GridColumns } from "@vx/grid";
import { curveMonotoneX } from "@vx/curve";
import { LinearGradient } from "@vx/gradient";
import { Text } from "@vx/text";
import { localPoint } from "@vx/event";
import { Redirect } from "react-router-dom";

import { TurnipContext } from "../../contexts";
import { DAY_SHORT_LABELS } from "../../utils/constants";
import { extent, addPadding } from "../../utils/graphs";

import { ReactComponent as Bells } from "../../res/images/bells-flat.svg";

const isMobileDevice =
  typeof window.orientation !== "undefined" ||
  navigator.userAgent.indexOf("IEMobile") !== -1;

const Graph = withParentSize(
  ({ weekValues, parentHeight, parentWidth, withTooltip }) => {
    const formattedValues = useMemo(
      () =>
        weekValues.map((val) => ({
          ...val,
          dayLabel:
            (val.day + 1) % 2 === 0
              ? DAY_SHORT_LABELS[(val.day + 1) / 2 - 1]
              : "",
        })),
      [weekValues]
    );

    const x = (d) => d.day;
    const y = (d) => d.value;

    const [minValue, maxValue] = useMemo(() => extent(formattedValues, y), [
      weekValues,
    ]);

    const xScale = scaleLinear({
      range: [0, parentWidth],
      domain: [1, 12],
    });

    const dayScale = scaleLinear({
      range: [0, parentWidth],
      domain: [0.5, 11.5],
    });

    const colScale = scaleLinear({
      range: [0 - parentWidth / 2, parentWidth + parentWidth / 2],
      domain: [0.5, 11.5],
    });

    const yScale = scaleLinear({
      range: [parentHeight, 0],
      domain: addPadding(extent(formattedValues, y), 20, 20),
      // nice: true
    });

    const xOffsetIfTooHigh = (left) => (left > parentWidth * 0.9 ? -65 : 0);

    const [tooltip, setTooltip] = useState(null);

    const handleTooltip = ({ event, isTouch }) => {
      if (!withTooltip && isTouch) return;

      const { x } = localPoint(event);
      const x0 = Math.round(xScale.invert(x));
      const rx = Math.round(xScale(x0));
      const found = formattedValues.find((val) => val.day === x0);
      const y0 = found.value;
      const ry = yScale(y0);

      if (tooltip && tooltip.left === rx && tooltip.top === ry) return;
      if (y0 === null) {
        setTooltip(null);
        return;
      }

      setTooltip({
        data: y0,
        left: rx,
        top: ry,
      });
    };

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
          <GridColumns
            lineStyle={{ pointerEvents: "none" }}
            scale={colScale}
            height={200}
            strokeDasharray="2,2"
            stroke="#80808040"
          />

          <AreaClosed
            data={formattedValues}
            fill={"url(#gradient)"}
            x={(d) => xScale(x(d))}
            y={(d) => yScale(y(d))}
            yScale={yScale}
            xScale={xScale}
            defined={(d) => y(d)}
            curve={curveMonotoneX}
          />

          <LinePath
            data={formattedValues}
            x={(d) => xScale(x(d))}
            y={(d) => yScale(y(d))}
            defined={(d) => y(d)}
            stroke="#A6D5B3"
            strokeWidth={2}
            curve={curveMonotoneX}
          />

          {formattedValues.filter(y).map((d) => (
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
          {formattedValues.map((d, i) => (
            <Text
              x={
                i === 0
                  ? dayScale(x(d)) + 10
                  : i === formattedValues.length - 2
                  ? dayScale(x(d)) - 10
                  : dayScale(x(d))
              }
              y={parentHeight - parentHeight * 0.1}
              fill="#80808040"
              textAnchor="middle"
            >
              {d.dayLabel}
            </Text>
          ))}

          <Bar
            x={0}
            y={0}
            width={parentWidth}
            height={parentHeight}
            fill="transparent"
            rx={14}
            data={formattedValues}
            onTouchStart={(event) =>
              handleTooltip({
                event,
                isTouch: true,
              })
            }
            onMouseMove={(event) =>
              !isMobileDevice &&
              handleTooltip({
                event,
              })
            }
            onMouseLeave={(event) => setTooltip(null)}
            onTouchEnd={(event) => setTooltip(null)}
          />
        </Group>
        {tooltip && (
          <g>
            <Line
              from={{ x: tooltip.left, y: 0 }}
              to={{ x: tooltip.left, y: 200 }}
              stroke="rgba(92, 119, 235, 1.000)"
              strokeWidth={2}
              style={{ pointerEvents: "none" }}
              strokeDasharray="2,2"
            />
            <circle
              cx={tooltip.left}
              cy={tooltip.top + 1}
              r={4}
              fill="black"
              fillOpacity={0.1}
              stroke="black"
              strokeOpacity={0.1}
              strokeWidth={2}
              style={{ pointerEvents: "none" }}
            />
            <circle
              cx={tooltip.left}
              cy={tooltip.top}
              r={4}
              fill="rgba(92, 119, 235, 1.000)"
              stroke="white"
              strokeWidth={2}
              style={{ pointerEvents: "none" }}
            />
            <rect
              x={tooltip.left + 6 + xOffsetIfTooHigh(tooltip.left)}
              y={
                tooltip.data > maxValue * 0.8
                  ? tooltip.top - 17 + parentWidth * 0.05
                  : tooltip.top - 17 - parentWidth * 0.03
              }
              width={53}
              height={25}
              rx={3}
              ry={3}
              fill="rgba(92, 119, 235, 1.000)"
            />
            <Text
              x={tooltip.left + 36 + xOffsetIfTooHigh(tooltip.left)}
              y={
                tooltip.data > maxValue * 0.8
                  ? tooltip.top + parentWidth * 0.05
                  : tooltip.top - parentWidth * 0.03
              }
              fill="white"
              textAnchor="end"
            >
              {tooltip.data}
            </Text>
            <Bells
              x={tooltip.left + 38 + xOffsetIfTooHigh(tooltip.left)}
              y={
                tooltip.data > maxValue * 0.8
                  ? tooltip.top - 13 + parentWidth * 0.05
                  : tooltip.top - 13 - parentWidth * 0.03
              }
              width={15}
              height={15}
            />
          </g>
        )}
      </svg>
    );
  }
);

const WeekGraph = ({ trend, withPseudo, currentUserId, withTooltip }) => {
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
      <Graph weekValues={weekValues} withTooltip={withTooltip} />
    </div>
  );
};

export default WeekGraph;
