import React, { useState, useRef, useEffect } from "react";
import { useSpring, animated } from "react-spring";
import data from "./potions.json";
import * as d3 from "d3";
import { isUndefined } from "lodash";

data.forEach((d) => {
  d["complexity"] = parseInt(d["complexity"]);
  d["brew_time_min"] = parseInt(d["brew_time_min"]);
});

const AnimatedCircle = (props) => {
  const style = useSpring({
    config: {
      duration: 800,
    },
    r: props.isHover ? 8 : 5,
    stroke: props.isHover ? "black" : props.fill,
  });

  return (
    <animated.circle
      {...style}
      cx={props.cx}
      cy={props.cy}
      fill={props.fill}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
    />
  );
};

export default function Chart() {
  const refAxisBottom = useRef();
  const refAxisLeft = useRef();

  const [hoverPoint, setHoverPoint] = useState();
  const width = window.screen.width * 0.3;
  const height = width * (3 / 4);
  const padding = 40;

  const drawAxis = () => {
    const axisLeft = d3.select(refAxisLeft.current);
    const axisBottom = d3.select(refAxisBottom.current);

    axisLeft.attr("transform", `translate(${padding}, 0)`).call(d3.axisLeft(y));

    axisBottom
      .attr("transform", `translate(0, ${height - padding})`)
      .call(d3.axisBottom(x));
  };

  useEffect(() => {
    drawAxis();
  }, []);

  const x = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d["brew_time_min"]))
    .range([padding, width - padding])
    .nice();

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d["complexity"])])
    .range([height - padding, padding])
    .nice();

  return (
    <svg
      width={width}
      height={height}
      className="m-auto border border-gray-300"
    >
      {data.map((d) => (
        <AnimatedCircle
          cx={x(d["brew_time_min"])}
          cy={y(d["complexity"])}
          fill={d.color}
          onMouseEnter={() => setHoverPoint(d)}
          onMouseLeave={() => setHoverPoint()}
          isHover={d.potion === hoverPoint?.potion}
        />
      ))}
      {!isUndefined(hoverPoint) ? (
        <text
          transform={`translate(${x(hoverPoint["brew_time_min"])}, ${y(
            hoverPoint["complexity"]
          )})`}
          dy={-12}
          className="point-label text-xs"
        >
          {hoverPoint.potion}
        </text>
      ) : null}
      <g ref={refAxisLeft} />
      <g ref={refAxisBottom} />
    </svg>
  );
}
