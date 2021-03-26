import React, { useState } from "react";
import { useSpring, animated } from "react-spring";
import data from "./potions.json";
import * as d3 from "d3";
import { isUndefined } from "lodash";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { Text } from "@visx/text";
import { GlyphStar } from "@visx/glyph";
import { scaleLinear } from "@visx/scale";

data.forEach((d) => {
  d["complexity"] = parseInt(d["complexity"]);
  d["brew_time_min"] = parseInt(d["brew_time_min"]);
});

export default function ChartNaive() {
  const [hoverPoint, setHoverPoint] = useState();
  const width = window.screen.width * 0.3;
  const height = width * (3 / 4);
  const padding = 40;

  const x = scaleLinear({
    domain: d3.extent(data, (d) => d["brew_time_min"]),
    range: [padding, width - padding],
    nice: true,
  });

  const y = scaleLinear({
    domain: [0, d3.max(data, (d) => d["complexity"])],
    range: [height - padding, padding],
    nice: true,
  });

  return (
    <svg
      width={width}
      height={height}
      className="m-auto border border-gray-300"
    >
      {data.map((d) => (
        <GlyphStar
          key={`circle-${d.potion}`}
          left={x(d["brew_time_min"])}
          top={y(d["complexity"])}
          fill={d.color}
          size={40}
          stroke={hoverPoint?.potion === d.potion ? "black" : d.color}
          onMouseEnter={() => setHoverPoint(d)}
          onMouseLeave={() => setHoverPoint()}
        />
      ))}
      {!isUndefined(hoverPoint) ? (
        <Text
          x={x(hoverPoint["brew_time_min"])}
          y={y(hoverPoint["complexity"])}
          dy={-12}
          className="point-label text-xs"
        >
          {hoverPoint.potion}
        </Text>
      ) : null}
      <AxisBottom
        scale={x}
        top={height - padding}
        label="Brew Time"
        labelOffset={5}
      />
      <AxisLeft scale={y} left={padding} label="Complexity" labelOffset={20} />
    </svg>
  );
}
